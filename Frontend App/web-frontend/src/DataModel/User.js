import React from 'react';

export class User {
    constructor(username, name, lastname, address, birthday, userType, email, profilePictureUrl, id, verified) {
        this.username = username;
        this.name = name;
        this.lastname = lastname;
        this.address = address;
        this.birthday = birthday;
        this.userType = userType;
        this.email = email;
        this.profilePictureUrl = profilePictureUrl;
        this.id = id;
        this.verified = verified;
    }
    
    isVerified() {
        return this.verified === true;
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
            obj.lastname,
            obj.address,
            obj.birthday,
            obj.userType,
            obj.email,
            obj.profilePictureUrl,
            obj.id,
            obj.verified
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

