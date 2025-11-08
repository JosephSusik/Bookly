//
//  booklyApp.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import SwiftUI

@main
struct booklyApp: App {
    @StateObject private var authManager = AuthManager()
    
    var body: some Scene {
        WindowGroup {
            if authManager.isAuthenticated {
                MainTabView()
                    .environmentObject(authManager)
            } else {
                LoginView()
                    .environmentObject(authManager)
            }
        }
    }
}
