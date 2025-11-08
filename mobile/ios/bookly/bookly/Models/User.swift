//
//  User.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let name: String
    let surname: String
    let role: String
    let createdAt: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case email
        case name
        case surname
        case role
        case createdAt
    }
}

struct LoginResponse: Codable {
    let token: String
    let user: User
    let message: String
}

