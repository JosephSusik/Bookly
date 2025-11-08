//
//  BooksListView.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import SwiftUI

struct BooksListView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var books: [Book] = []
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    var body: some View {
        NavigationView {
            Group {
                if isLoading {
                    ProgressView("Loading books...")
                } else if let error = errorMessage {
                    VStack(spacing: 16) {
                        Text("Error")
                            .font(.headline)
                        Text(error)
                            .font(.caption)
                            .foregroundColor(.red)
                        Button("Retry") {
                            loadBooks()
                        }
                    }
                } else if books.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "books.vertical")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        Text("No books yet")
                            .font(.headline)
                        Text("Add your first book using the Add tab")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                } else {
                    List(books) { book in
                        BookRowView(book: book)
                    }
                }
            }
            .navigationTitle("My Books")
            .refreshable {
                await loadBooksAsync()
            }
        }
        .onAppear {
            loadBooks()
        }
    }
    
    private func loadBooks() {
        Task {
            await loadBooksAsync()
        }
    }
    
    private func loadBooksAsync() async {
        guard let userId = authManager.currentUser?.id,
              let token = authManager.token else {
            errorMessage = "Not authenticated"
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        do {
            books = try await APIService.shared.fetchMyBooks(userId: userId, token: token)
        } catch {
            errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
}

struct BookRowView: View {
    let book: Book
    
    var body: some View {
        HStack(spacing: 12) {
            // Cover placeholder
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.gray.opacity(0.3))
                .frame(width: 60, height: 90)
                .overlay {
                    Image(systemName: "book.closed")
                        .foregroundColor(.gray)
                }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(book.title)
                    .font(.headline)
                    .lineLimit(2)
                
                if let subtitle = book.subtitle {
                    Text(subtitle)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                }
                
                if !book.authors.isEmpty {
                    Text(book.authors.joined(separator: ", "))
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                }
                
                if let isbn = book.ISBN {
                    Text("ISBN: \(isbn)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            
            Spacer()
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    BooksListView()
        .environmentObject(AuthManager())
}

