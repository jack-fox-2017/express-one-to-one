'use strict'

var sqlite3 = require('sqlite3').verbose() // lbh detailin kalo ada error// kalo da production fileny di ilangin
var db = new sqlite3.Database('./db/data.db')

function createTable(){
  // db.run(`CREATE TABLE IF NOT EXISTS Contacts (
  // id INTEGER primary key AUTOINCREMENT,
  // name varchar(50),
  // company varchar(50),
  // telp_number varchar(15),
  // email varchar(50)
  // );`)

  db.run(`CREATE TABLE IF NOT EXISTS Groups (
  id INTEGER primary key AUTOINCREMENT,
  name_of_group varchar(50)
  );`)

  db.run(`CREATE TABLE IF NOT EXISTS Addresses (
  id INTEGER primary key AUTOINCREMENT,
  street varchar(50),
  city varchar(50),
  zip_code varchar(50),
  contacts_id INTEGER
  );`)

  // db.run(`CREATE TABLE IF NOT EXISTS Profiles (
  // id INTEGER primary key AUTOINCREMENT,
  // username varchar(50),
  // password varchar(50),
  // contacts_id INTEGER
  // );`)

  // db.run(`CREATE TABLE IF NOT EXISTS Profiles (
  // id INTEGER primary key AUTOINCREMENT,
  // username varchar(50),
  // password varchar(50),
  // contacts_id INTEGER
  // );`)


  db.serialize(function() {
    db.run(`CREATE TABLE IF NOT EXISTS Contacts (
    id INTEGER primary key AUTOINCREMENT,
    name varchar(50),
    company varchar(50),
    telp_number varchar(15),
    email varchar(50)
    );`)

    db.run(`CREATE TABLE IF NOT EXISTS Profiles (
    id INTEGER primary key AUTOINCREMENT,
    username varchar(50),
    password varchar(50),
    contacts_id INTEGER UNIQUE, FOREIGN KEY(contacts_id) REFERENCES Contacts(id)
    );`)
  });

  db.run(`CREATE TABLE IF NOT EXISTS ContactGroups (
  id INTEGER primary key AUTOINCREMENT,
  contacts_id INTEGER,
  groups_id INTEGER
  );`)
}

function dropTableContacts() {
  db.run(`DROP TABLE Contacts`);
}

function dropTableGroups() {
  db.run(`DROP TABLE Groups`);
}

function dropTableProfiles() {
  db.run(`DROP TABLE Profiles`);
}

function dropTableAddresses() {
  db.run(`DROP TABLE Addresses`);
}

createTable();
// dropTableProfiles();
