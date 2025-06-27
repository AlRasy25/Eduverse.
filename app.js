// app.js

document.addEventListener('DOMContentLoaded', () => {
    // ========================================================
    // BAGIAN 1: SISTEM LOGIN & AUTENTIKASI (YANG SUDAH ADA)
    // ========================================================
    
    const dummyUsers = [
        { username: 'rasyid', password: 'password123', fullName: 'Rasyid', role: 'Siswa' },
        { username: 'mingyu', password: 'password123', fullName: 'Mingyu', role: 'punya naya' },
        { username: 'jaemin', password: 'password123', fullName: 'Jaemin', role: 'Mahasiswa' },
        { username: 'bosbena', password: 'password123', fullName: 'Bos Bena', role: 'Direktur' },
        { username: 'dinda', password: 'password123', fullName: 'Dinda', role: 'Guru' },
        { username: 'nafla', password: 'password123', fullName: 'Nafla', role: 'Siswa' },
        { username: 'khaerudin', password: 'password123', fullName: 'Dr. Khaerudin', role: 'Dosen' }
    ];

    const authArea = document.getElementById('authArea');
    const loginModal = document.getElementById('loginModal');
    const profileModal = document.getElementById('profileModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeProfileModal = document.getElementById('closeProfileModal');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const profileDetails = document.getElementById('profileDetails');
    const loginError = document.getElementById('loginError');

    const renderLoginButton = () => {
        if (!authArea) return;
        authArea.innerHTML = `
            <button id="openLoginBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 flex items-center">
                <i class="fas fa-sign-in-alt mr-2"></i> Login
            </button>
        `;
        document.getElementById('openLoginBtn').addEventListener('click', () => {
            if(loginModal) loginModal.classList.remove('hidden');
        });
    };

    const renderUserProfile = (user) => {
        if (!authArea) return;
        const initial = user.fullName.charAt(0).toUpperCase();
        authArea.innerHTML = `
            <button id="openProfileBtn" class="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-300">
                <span class="font-semibold text-sm hidden sm:block">${user.fullName}</span>
                <div class="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-base">
                    ${initial}
                </div>
            </button>
        `;
        if (profileDetails) {
            profileDetails.innerHTML = `
                <div class="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    ${initial}
                </div>
                <p class="text-xl font-bold text-gray-800">${user.fullName}</p>
                <p class="text-gray-500">${user.role}</p>
            `;
        }
        document.getElementById('openProfileBtn').addEventListener('click', () => {
            if(profileModal) profileModal.classList.remove('hidden');
        });
    };

    const checkLoginStatus = () => {
        const currentUser = localStorage.getItem('eduverseUser');
        if (currentUser) {
            renderUserProfile(JSON.parse(currentUser));
        } else {
            renderLoginButton();
        }
        // Panggil fungsi update status registrasi setelah cek login
        updateAllRegistrationButtons();
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.toLowerCase();
            const password = document.getElementById('password').value;
            if(loginError) loginError.textContent = '';

            const foundUser = dummyUsers.find(user => user.username === username && user.password === password);

            if (foundUser) {
                localStorage.setItem('eduverseUser', JSON.stringify(foundUser));
                if(loginModal) loginModal.classList.add('hidden');
                loginForm.reset();
                checkLoginStatus();
            } else {
                if(loginError) loginError.textContent = 'Username atau password salah.';
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('eduverseUser');
            if(profileModal) profileModal.classList.add('hidden');
            checkLoginStatus();
        });
    }
    
    if (closeLoginModal) closeLoginModal.addEventListener('click', () => loginModal.classList.add('hidden'));
    if (closeProfileModal) closeProfileModal.addEventListener('click', () => profileModal.classList.add('hidden'));

    // ========================================================
    // BAGIAN 2: LOGIKA BARU UNTUK REGISTRASI PROGRAM
    // ========================================================
    
    const programContainer = document.getElementById('accordion-container');

    // Fungsi untuk mengubah tampilan tombol menjadi "Terdaftar"
    const setButtonToRegistered = (button) => {
        button.disabled = true;
        button.innerHTML = `<i class="fas fa-check-circle mr-2"></i>Anda Sudah Terdaftar`;
    };
    
    // Fungsi untuk memeriksa dan memperbarui status semua tombol daftar di halaman
    const updateAllRegistrationButtons = () => {
        const currentUser = JSON.parse(localStorage.getItem('eduverseUser'));
        if (!currentUser || !programContainer) return; // Keluar jika tidak login atau bukan di halaman program

        const registrations = JSON.parse(localStorage.getItem('programRegistrations')) || {};
        const userRegistrations = registrations[currentUser.username] || [];

        const registerButtons = document.querySelectorAll('.register-btn');
        registerButtons.forEach(button => {
            const programName = button.dataset.program;
            if (userRegistrations.includes(programName)) {
                setButtonToRegistered(button);
            }
        });
    };
    
    // Event listener utama pada container program
    if (programContainer) {
        programContainer.addEventListener('click', (e) => {
            // Cek apakah yang diklik adalah tombol daftar
            if (e.target && e.target.classList.contains('register-btn')) {
                const button = e.target;
                const programName = button.dataset.program;
                const currentUser = JSON.parse(localStorage.getItem('eduverseUser'));

                // Jika belum login, tampilkan modal login
                if (!currentUser) {
                    if (loginModal) loginModal.classList.remove('hidden');
                    return;
                }

                // Jika sudah login, proses pendaftaran
                const registrations = JSON.parse(localStorage.getItem('programRegistrations')) || {};
                
                // Siapkan array pendaftaran untuk user ini jika belum ada
                if (!registrations[currentUser.username]) {
                    registrations[currentUser.username] = [];
                }
                
                // Tambahkan program ke daftar & simpan
                if (!registrations[currentUser.username].includes(programName)) {
                    registrations[currentUser.username].push(programName);
                    localStorage.setItem('programRegistrations', JSON.stringify(registrations));
                    
                    // Beri konfirmasi dan ubah tombol
                    alert(`Selamat, ${currentUser.fullName}! Anda berhasil mendaftar untuk program ${programName}.`);
                    setButtonToRegistered(button);
                }
            }
        });
    }

    // --- INISIALISASI ---
    checkLoginStatus(); // Ini akan menjalankan semua pengecekan saat halaman dimuat
});
