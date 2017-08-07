# express-one-to-one

/**
/** EXPRESS WITH SQLITE3 - ONE TO ONE
---------------------------
Buatlah sebuah aplikasi sederhana menggunakan Express JS dan SQLITE3 untuk
menampilkan list User & Profile, menambah data User & Profile,
melakukan edit data dan delete data berdasarkan data yang dipilih dengan relasi User one to one dengan Profile.

- Release 0
1. Buatlah file dengan nama setup.js yang akan dijalankan pertama kali untuk membuat
table pada database. Tentukan column mana saja yang akan di set unique.
2. Berikan validasi di query create table sehingga meskipun setup dijalankan berulang
kali, tidak error

Structure table:
* Users: id type integer, username type string, firstname type string, lastname type string, email type string
* Profiles: id type integer, hometown type string, birth_year type integer, relationship_status
* tambahkan foreign key yang diperlukan!

Jalankan dengan : node setup.js, kemudian lihat ke database apakah table Users dan Profiles sudah terbuat.

- Release 1 - CRUD User
1. Buat sebuah aplikasi express yang baru, kemudian tambahkan beberapa routes yang respon nya me-render view(ejs) dengan keterangan sbb:

----------------------------------------------------------------------
METHOD | ROUTE                | KETERANGAN
----------------------------------------------------------------------
GET    | /                    | Menampilkan link Users, Profiles
GET    | /users               | Menampilkan semua data users
POST   | /users               | Menerima data dari form untuk input users
GET    | /users/edit/:id      | Menampilkan data dari user tertentu untuk diubah
POST   | /users/edit/:id      | Menerima data form untuk update user
GET    | /users/delete/:id    | Menghapus data user berdasarkan id

Ketika edit, data user harus di populate ke masing-masing input form nya.

- Release 2 - CRUD Profile
1. Lanjutkan release 1, tambahkan beberapa routes yang respon nya me-render view(ejs) dengan keterangan sbb:

----------------------------------------------------------------------
METHOD | ROUTE                | KETERANGAN
----------------------------------------------------------------------
GET    | /profiles            | Menampilkan semua data profiles
POST   | /profiles            | Menerima data dari form untuk input profiles
GET    | /profiles/edit/:id   | Menampilkan data dari profiles tertentu untuk diubah
POST   | /profiles/edit/:id   | Menerima data form untuk update profiles
GET    | /profiles/delete/:id | Menghapus data profiles berdasarkan id

Input fields untuk user id nya harus dalam bentuk drop down yang menampilkan username nya.

Ketika edit, data profile harus di populate ke masing-masing input form nya, termasuk selected drop down nya, dan saat ini user_id tidak boleh dirubah.

Karena User one to one dengan Profile, maka 1 User hanya boleh memiliki 1 Profile. Tambahkan validasi ketika create Profile, User yang sudah memiliki Profile tidak dapat ditambah lagi.

- Release 3 (Optional) -
Tambahkan validasi pada form User, username tidak boleh kosong. Tambahkan validasi pada form Profile, hometown tidak boleh kosong.

Silahkan tambahkan table baru, tentukan sendiri nama table, column, dan relasi nya, kemudian buat kembali CRUD nya dengan route yang sesuai.
**/
