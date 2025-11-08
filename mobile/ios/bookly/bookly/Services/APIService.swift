//
//  APIService.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import Foundation

class APIService {
    static let shared = APIService()
    
    // TODO: Update this with your actual API URL
    // NOTE: For iOS Simulator, use "http://localhost:3001" or "http://127.0.0.1:3001"
    // NOTE: For physical device, use your Mac's IP address: "http://192.168.1.XXX:3001"
    private let baseURL = "http://127.0.0.1:3001" // Change to your backend URL
    

    
    private init() {}
    
    // MARK: - Authentication
    
    func login(email: String, password: String) async throws -> LoginResponse {
        guard let url = URL(string: "\(baseURL)/api/users/login") else {
            throw APIError.serverError("Invalid URL: \(baseURL)/api/users/login")
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 10.0
        
        let body: [String: String] = [
            "email": email,
            "password": password
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }
            
            guard httpResponse.statusCode == 200 else {
                let errorMessage: String
                if let errorData = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                    errorMessage = errorData.error
                } else if let responseString = String(data: data, encoding: .utf8) {
                    errorMessage = "Server error (Status \(httpResponse.statusCode)): \(responseString)"
                } else {
                    errorMessage = "Login failed with status code: \(httpResponse.statusCode)"
                }
                throw APIError.serverError(errorMessage)
            }
            
            do {
                return try JSONDecoder().decode(LoginResponse.self, from: data)
            } catch {
                if let responseString = String(data: data, encoding: .utf8) {
                    throw APIError.serverError("Failed to decode response: \(responseString)")
                }
                throw APIError.serverError("Failed to decode login response: \(error.localizedDescription)")
            }
        } catch let error as APIError {
            throw error
        } catch {
            // Network errors
            if let urlError = error as? URLError {
                switch urlError.code {
                case .notConnectedToInternet:
                    throw APIError.serverError("No internet connection")
                case .timedOut:
                    throw APIError.serverError("Request timed out. Is the server running at \(baseURL)?")
                case .cannotFindHost, .cannotConnectToHost:
                    throw APIError.serverError("Cannot connect to server at \(baseURL). Make sure the server is running.")
                default:
                    throw APIError.serverError("Network error: \(urlError.localizedDescription)")
                }
            }
            throw APIError.serverError("Unexpected error: \(error.localizedDescription)")
        }
    }
    
    func getCurrentUser(token: String) async throws -> User {
        let url = URL(string: "\(baseURL)/api/users/me")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw APIError.serverError("Failed to fetch user")
        }
        
        return try JSONDecoder().decode(User.self, from: data)
    }
    
    // MARK: - Books
    
    func fetchMyBooks(userId: String, token: String) async throws -> [Book] {
        let url = URL(string: "\(baseURL)/api/books/\(userId)")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw APIError.serverError("Failed to fetch books")
        }
        
        return try JSONDecoder().decode([Book].self, from: data)
    }
    
    func searchBookByISBN(isbn: String, token: String) async throws -> SearchByISBNResponse {
        let url = URL(string: "\(baseURL)/api/books/search-by-isbn")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let body: [String: String] = ["ISBN": isbn]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            if let errorData = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                throw APIError.serverError(errorData.error)
            }
            throw APIError.serverError("Failed to search for book")
        }
        
        return try JSONDecoder().decode(SearchByISBNResponse.self, from: data)
    }
    
    func createBook(data: CreateBookData, token: String) async throws -> Book {
        let url = URL(string: "\(baseURL)/api/books")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        request.httpBody = try JSONEncoder().encode(data)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 || httpResponse.statusCode == 201 else {
            if let errorData = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                throw APIError.serverError(errorData.error)
            }
            throw APIError.serverError("Failed to create book")
        }
        
        return try JSONDecoder().decode(Book.self, from: data)
    }
}

// MARK: - Error Types

enum APIError: LocalizedError {
    case invalidResponse
    case serverError(String)
    
    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Invalid response from server"
        case .serverError(let message):
            return message
        }
    }
}

struct ErrorResponse: Codable {
    let error: String
}

