import React from 'react';

export class User {
    constructor(username, name, surname, address, birthday, userType, email, profilePictureUrl, id, verified, blocked) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.address = address;
        this.birthday = birthday;
        this.userType = userType;
        this.email = email;
        this.profilePictureUrl = profilePictureUrl;
        this.id = id;
        this.verified = verified;
        this.blocked = blocked;
    }
    
    isVerified() {
        return this.verified === true;
    }
    isBlocked(){
        return this.blocked === true;
    }
    Username(){
      return this.username;
    }

    Role() {
      return this.userType;
  }

    static fromObject(obj) {
        return new User(
            obj.username,
            obj.name,
            obj.surname,
            obj.address,
            obj.birthday,
            obj.userType,
            obj.email,
            obj.profilePictureUrl,
            obj.id,
            obj.verified,
            obj.blocked
        );
    }
}

export function getUserFromLocalStorage() {
  const userJson = localStorage.getItem('user');

  if (userJson) {
      const userObj = JSON.parse(userJson);

      return User.fromObject(userObj);
  }

  return null; 
}

