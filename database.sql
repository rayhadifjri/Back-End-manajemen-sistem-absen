CREATE DATABASE serverdb;

CREATE TABLE users (
	id_user SERIAL PRIMARY KEY NOT NULL,
	username VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL,
	foto_user TEXT,
	email VARCHAR(100) NOT NULL UNIQUE,
	id_level INT NOT NULL DEFAULT 8,
	no_personel VARCHAR(100) NOT NULL UNIQUE,
	refresh_token TEXT,
	"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (id_level) REFERENCES levels(id_level),
);

CREATE TABLE levels (
	id_level SERIAL PRIMARY KEY NOT NULL,
	nama_level VARCHAR(100) NOT NULL
);

CREATE TABLE prodi (
	id_prodi SERIAL PRIMARY KEY NOT NULL,
	nama_prodi VARCHAR(100) NOT NULL,
	id_fakultas INT NOT NULL,
	FOREIGN KEY (id_fakultas) REFERENCES fakultas(id_fakultas)
);

CREATE TABLE fakultas (
	id_fakultas SERIAL PRIMARY KEY NOT NULL,
	nama_fakultas VARCHAR(100) NOT NULL
);

CREATE TABLE ketangkatan (
	id_ketangkatan SERIAL PRIMARY KEY NOT NULL,
	nama_angkatan VARCHAR(100) NOT NULL
);

CREATE TABLE angkatan (
	id_angkatan SERIAL PRIMARY KEY NOT NULL,
	id_user INT NOT NULL,
    id_ketangkatan INT NOT NULL,
	id_prodi INT NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users(id_user),
	FOREIGN KEY (id_ketangkatan) REFERENCES ketangkatan(id_ketangkatan),
	FOREIGN KEY (id_prodi) REFERENCES prodi(id_prodi)
);

CREATE TABLE matkul (
	id_matkul SERIAL PRIMARY KEY NOT NULL,
    nama_matkul VARCHAR(100) NOT NULL
);

CREATE TABLE periode (
	id_periode SERIAL PRIMARY KEY NOT NULL,
    nama_periode VARCHAR(100) NOT NULL
);

CREATE TABLE matkulperiode (
	id_matperiode SERIAL PRIMARY KEY NOT NULL,
	id_matkul INT NOT NULL,
	id_periode INT NOT NULL,
	FOREIGN KEY (id_matkul) REFERENCES matkul(id_matkul),
	FOREIGN KEY (id_periode) REFERENCES periode(id_periode)
);

CREATE TABLE pesertakelas (
	id_peskel SERIAL PRIMARY KEY NOT NULL,
	id_matperiode INT NOT NULL,
	id_prodi INT NOT NULL,
	id_user INT NOT NULL,
	FOREIGN KEY (id_matperiode) REFERENCES matkulperiode(id_matperiode),
	FOREIGN KEY (id_user) REFERENCES users(id_user),
	FOREIGN KEY (id_prodi) REFERENCES prodi(id_prodi)
);

CREATE TABLE jadwalharian (
	id_jadhar SERIAL PRIMARY KEY NOT NULL,
	id_matperiode INT NOT NULL, 
	id_user INT NOT NULL,
	pertemuan_ke INT NOT NULL,
	FOREIGN KEY (id_matperiode) REFERENCES matkulperiode(id_matperiode),
	FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE ketijin (
	id_ketijin SERIAL PRIMARY KEY NOT NULL,
	nama_ijin VARCHAR(100) NOT NULL
);

CREATE TABLE absen (
	id_absensi SERIAL PRIMARY KEY NOT NULL,
	id_jadhar INT NOT NULL,
	id_user INT NOT NULL,
	FOREIGN KEY (id_jadhar) REFERENCES jadwalharian(id_jadhar),
	FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE lokasi (
	id_lokasi SERIAL PRIMARY KEY NOT NULL,
	id_absensi INT NOT NULL,
    nama_lokasi VARCHAR(100) NOT NULL,
	FOREIGN KEY (id_absensi) REFERENCES absen(id_absensi)
);

CREATE TABLE ijinkhusus (
	id_ijinkhusus SERIAL PRIMARY KEY NOT NULL,
	id_user INT NOT NULL,
	id_ketijin INT NOT NULL,
    tanggal_mulai DATE NOT NULL,
	tanggal_selesai DATE NOT NULL,
	files TEXT NOT NULL,
	deskripsi TEXT NOT NULL,
	status_ijin INT NOT NULL, 
	FOREIGN KEY (id_user) REFERENCES users(id_user),
	FOREIGN KEY (id_ketijin) REFERENCES ketijin(id_ketijin)
);

CREATE TABLE fileperijinan (
	id_fileperijin SERIAL PRIMARY KEY NOT NULL,
	id_ijinkhusus INT NOT NULL,
    files TEXT NOT NULL,
	FOREIGN KEY (id_ijinkhusus) REFERENCES ijinkhusus(id_ijinkhusus)
);

CREATE TABLE tokenqr (
	id_tokenqr SERIAL PRIMARY KEY NOT NULL,
	id_ijinkhusus INT NOT NULL,
    token TEXT NOT NULL,
	FOREIGN KEY (id_ijinkhusus) REFERENCES ijinkhusus(id_ijinkhusus)
);

CREATE TABLE statusperijinan (
	id_statusperijinan SERIAL PRIMARY KEY NOT NULL,
	id_ijinkhusus INT NOT NULL,
    change INT NOT NULL,
	changed_by VARCHAR(255) NOT NULL,
	tanggal DATE NOT NULL,
	FOREIGN KEY (id_ijinkhusus) REFERENCES ijinkhusus(id_ijinkhusus)
);