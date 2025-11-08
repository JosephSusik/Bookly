//
//  AuthManager.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import Foundation

@MainActor
class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var token: String?
    
    private let tokenKey = "bookly_token"
    private let userKey = "bookly_user"
    
    init() {
        loadAuthState()
    }
    
    func login(email: String, password: String) async throws {
        let response = try await APIService.shared.login(email: email, password: password)
        
        self.token = response.token
        self.currentUser = response.user
        self.isAuthenticated = true
        
        // Save to UserDefaults
        UserDefaults.standard.set(response.token, forKey: tokenKey)
        if let userData = try? JSONEncoder().encode(response.user) {
            UserDefaults.standard.set(userData, forKey: userKey)
        }
    }
    
    func logout() {
        self.token = nil
        self.currentUser = nil
        self.isAuthenticated = false
        
        // Clear UserDefaults
        UserDefaults.standard.removeObject(forKey: tokenKey)
        UserDefaults.standard.removeObject(forKey: userKey)
    }
    
    private func loadAuthState() {
        if let savedToken = UserDefaults.standard.string(forKey: tokenKey),
           let userData = UserDefaults.standard.data(forKey: userKey),
           let user = try? JSONDecoder().decode(User.self, from: userData) {
            self.token = savedToken
            self.currentUser = user
            self.isAuthenticated = true
        }
    }
}

