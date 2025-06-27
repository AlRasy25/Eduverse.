// app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DATABASE PENGGUNA DUMMY ---
    const dummyUsers = [
        { username: 'rasyid', password: 'password123', fullName: 'Rasyid', role: 'Siswa' },
        { username: 'mingyu', password: 'password123', fullName: 'Mingyu', role: 'Siswa' },
        { username: 'jaemin', password: 'password123', fullName: 'Jaemin', role: 'Mahasiswa' },
        { username: 'bosbena', password: 'password123', fullName: 'Bos Bena', role: 'Umum' },
        { username: 'dinda', password: 'password123', fullName: 'Dinda', role: 'Guru' },
        { username: 'nafla', password: 'password123', fullName: 'Nafla', role: 'Siswa' },
        { username: 'khaerudin', password: 'password123', fullName: 'Dr. Khaerudin', role: 'Dosen' }
    ];

    // --- PENGAMBILAN ELEMEN DOM ---
    const authArea = document.getElementById('authArea');
    const loginModal = document.getElementById('loginModal');
    const profileModal = document.getElementById('profileModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeProfileModal = document.getElementById('closeProfileModal');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const profileDetails = document.getElementById('profileDetails');
    const loginError = document.getElementById('loginError');

    // --- FUNGSI UNTUK MERENDER TAMPILAN ---

    // Tampilkan tombol Login jika tidak ada session
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

    // Tampilkan info profil jika ada session
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

    // --- LOGIKA UTAMA ---

    // Cek status login saat halaman dimuat
    const checkLoginStatus = () => {
        const currentUser = localStorage.getItem('eduverseUser');
        if (currentUser) {
            renderUserProfile(JSON.parse(currentUser));
        } else {
            renderLoginButton();
        }
    };

    // Event listener hanya ditambahkan jika elemennya ada
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
    
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => loginModal.classList.add('hidden'));
    }
    
    if (closeProfileModal) {
        closeProfileModal.addEventListener('click', () => profileModal.classList.add('hidden'));
    }

    // --- INISIALISASI ---
    checkLoginStatus();
});
