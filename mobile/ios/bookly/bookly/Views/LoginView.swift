//
//  LoginView.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    var body: some View {
        VStack(spacing: 24) {
            // Title
            Text("Bookly")
                .font(.system(size: 48, weight: .bold))
                .padding(.top, 60)
            
            Spacer()
            
            // Email Input
            VStack(alignment: .leading, spacing: 8) {
                Text("Email")
                    .font(.headline)
                TextField("Enter your email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
            }
            
            // Password Input
            VStack(alignment: .leading, spacing: 8) {
                Text("Password")
                    .font(.headline)
                SecureField("Enter your password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }
            
            // Error Message
            if let error = errorMessage {
                Text(error)
                    .foregroundColor(.red)
                    .font(.caption)
            }
            
            // Login Button
            Button(action: handleLogin) {
                if isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                } else {
                    Text("Login")
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(isLoading || email.isEmpty || password.isEmpty)
            
            Spacer()
        }
        .padding(.horizontal, 32)
        .onAppear {
            // Pre-fill for localhost testing
            #if DEBUG
            email = "admin@bookly.com"
            password = "Test1234."
            #endif
        }
    }
    
    private func handleLogin() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                try await authManager.login(email: email, password: password)
                // Login successful - authManager will update isAuthenticated
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    isLoading = false
                }
            }
        }
    }
}

#Preview {
    LoginView()
}

