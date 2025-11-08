//
//  ProfileView.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var currentUser: User?
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            Form {
                if let user = currentUser ?? authManager.currentUser {
                    Section(header: Text("Profile Information")) {
                        HStack {
                            Text("Name")
                            Spacer()
                            Text("\(user.name) \(user.surname)")
                                .foregroundColor(.secondary)
                        }
                        
                        HStack {
                            Text("Email")
                            Spacer()
                            Text(user.email)
                                .foregroundColor(.secondary)
                        }
                        
                        HStack {
                            Text("Role")
                            Spacer()
                            Text(user.role)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                Section {
                    Button(action: handleLogout) {
                        HStack {
                            Spacer()
                            Text("Logout")
                                .foregroundColor(.red)
                                .fontWeight(.semibold)
                            Spacer()
                        }
                    }
                }
            }
            .navigationTitle("Profile")
            .onAppear {
                loadUserInfo()
            }
        }
    }
    
    private func loadUserInfo() {
        guard let token = authManager.token else { return }
        
        isLoading = true
        Task {
            do {
                let user = try await APIService.shared.getCurrentUser(token: token)
                await MainActor.run {
                    currentUser = user
                    isLoading = false
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                }
            }
        }
    }
    
    private func handleLogout() {
        authManager.logout()
    }
}

#Preview {
    ProfileView()
        .environmentObject(AuthManager())
}

