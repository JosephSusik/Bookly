//
//  AddBookView.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import SwiftUI

struct AddBookView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var isScanning = false
    @State private var scannedISBN: String?
    @State private var showForm = false
    @State private var searchResult: SearchByISBNResponse?
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var showManualEntry = false
    @State private var manualISBN = ""
    @State private var cameraError: String?
    
    var body: some View {
        NavigationView {
            ZStack {
                if showForm, let result = searchResult {
                    AddBookFormView(
                        searchResult: result,
                        onSave: handleSaveBook,
                        onCancel: {
                            showForm = false
                            searchResult = nil
                            scannedISBN = nil
                            isScanning = false
                        }
                    )
                } else if showManualEntry {
                    // Manual ISBN entry
                    VStack(spacing: 24) {
                        Text("Enter ISBN Manually")
                            .font(.title2)
                            .fontWeight(.semibold)
                        
                        TextField("Enter ISBN", text: $manualISBN)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.numberPad)
                            .padding(.horizontal)
                        
                        HStack(spacing: 16) {
                            Button("Cancel") {
                                showManualEntry = false
                                manualISBN = ""
                            }
                            .buttonStyle(.bordered)
                            
                            Button("Search") {
                                if !manualISBN.isEmpty {
                                    searchBookByISBN(manualISBN)
                                }
                            }
                            .buttonStyle(.borderedProminent)
                            .disabled(manualISBN.isEmpty)
                        }
                        .padding(.horizontal)
                        
                        Spacer()
                    }
                    .padding()
                } else {
                    // Scanner view
                    VStack {
                        if isScanning {
                            BarcodeScannerView(
                                scannedISBN: $scannedISBN,
                                isScanning: $isScanning,
                                onCameraError: { error in
                                    cameraError = error
                                    isScanning = false
                                }
                            )
                            .edgesIgnoringSafeArea(.all)
                        } else {
                            VStack(spacing: 24) {
                                Image(systemName: "barcode.viewfinder")
                                    .font(.system(size: 80))
                                    .foregroundColor(.blue)
                                
                                Text("Scan Book Barcode")
                                    .font(.title2)
                                    .fontWeight(.semibold)
                                
                                Text("Tap the button below to scan the ISBN barcode from your book")
                                    .font(.body)
                                    .foregroundColor(.secondary)
                                    .multilineTextAlignment(.center)
                                    .padding(.horizontal)
                                
                                if let cameraError = cameraError {
                                    Text(cameraError)
                                        .font(.caption)
                                        .foregroundColor(.orange)
                                        .padding(.horizontal)
                                }
                                
                                Button(action: {
                                    isScanning = true
                                    cameraError = nil
                                }) {
                                    HStack {
                                        Image(systemName: "camera.fill")
                                        Text("Start Scanning")
                                    }
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 50)
                                    .background(Color.blue)
                                    .cornerRadius(12)
                                }
                                .padding(.horizontal, 32)
                                
                                Button(action: {
                                    showManualEntry = true
                                }) {
                                    HStack {
                                        Image(systemName: "keyboard")
                                        Text("Enter ISBN Manually")
                                    }
                                    .font(.subheadline)
                                    .foregroundColor(.blue)
                                }
                                .padding(.top, 8)
                            }
                            .padding()
                        }
                    }
                }
                
                if isLoading {
                    Color.black.opacity(0.3)
                        .edgesIgnoringSafeArea(.all)
                    ProgressView("Searching for book...")
                        .padding()
                        .background(Color.white)
                        .cornerRadius(12)
                }
                
                if let error = errorMessage {
                    VStack {
                        Spacer()
                        Text(error)
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.red)
                            .cornerRadius(12)
                            .padding()
                    }
                }
            }
            .navigationTitle("Add Book")
            .onChange(of: scannedISBN) { newValue in
                if let isbn = newValue {
                    searchBookByISBN(isbn)
                }
            }
            .onChange(of: manualISBN) { newValue in
                // Reset form when manual entry is cleared
                if newValue.isEmpty && showManualEntry {
                    // Keep manual entry view
                }
            }
        }
    }
    
    private func searchBookByISBN(_ isbn: String) {
        guard let token = authManager.token else {
            errorMessage = "Not authenticated"
            return
        }
        
        isLoading = true
        errorMessage = nil
        showManualEntry = false // Close manual entry view
        
        Task {
            do {
                let result = try await APIService.shared.searchBookByISBN(isbn: isbn, token: token)
                await MainActor.run {
                    searchResult = result
                    showForm = true
                    isLoading = false
                    manualISBN = "" // Clear manual ISBN
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    isLoading = false
                    // Reset scanning state
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                        errorMessage = nil
                        isScanning = false
                        scannedISBN = nil
                    }
                }
            }
        }
    }
    
    private func handleSaveBook(_ bookData: CreateBookData) {
        guard let token = authManager.token else {
            errorMessage = "Not authenticated"
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                _ = try await APIService.shared.createBook(data: bookData, token: token)
                await MainActor.run {
                    isLoading = false
                    showForm = false
                    searchResult = nil
                    scannedISBN = nil
                    isScanning = false
                }
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
    AddBookView()
        .environmentObject(AuthManager())
}

