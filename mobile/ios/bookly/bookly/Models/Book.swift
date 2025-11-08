//
//  Book.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import Foundation

struct Book: Codable, Identifiable {
    let id: String
    let ISBN: String?
    let title: String
    let subtitle: String?
    let publisher: String?
    let publishedDate: String?
    let pageCount: Int?
    let language: String?
    let description: String?
    let coverUrl: String?
    let authors: [String]
    let createdAt: String?
    let updatedAt: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case ISBN
        case title
        case subtitle
        case publisher
        case publishedDate = "published_date"
        case pageCount = "page_count"
        case language
        case description
        case coverUrl = "cover_url"
        case authors
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct SearchByISBNResponse: Codable {
    let source: String // "database" | "google_books" | "manual"
    let book: BookData
    let disabledFields: [String]
}

struct BookData: Codable {
    let ISBN: String?
    let title: String?
    let subtitle: String?
    let authors: [String]?
    let publisher: String?
    let publishedDate: String?
    let pageCount: Int?
    let language: String?
    let description: String?
    let coverUrl: String?
    
    enum CodingKeys: String, CodingKey {
        case ISBN
        case title
        case subtitle
        case authors
        case publisher
        case publishedDate = "published_date"
        case pageCount = "page_count"
        case language
        case description
        case coverUrl = "cover_url"
    }
}

struct CreateBookData: Codable {
    let ISBN: String?
    let title: String
    let subtitle: String?
    let authors: [String]?
    let publisher: String?
    let publishedDate: String?
    let pageCount: Int?
    let language: String?
    let description: String?
    let coverUrl: String?
    
    enum CodingKeys: String, CodingKey {
        case ISBN
        case title
        case subtitle
        case authors
        case publisher
        case publishedDate = "published_date"
        case pageCount = "page_count"
        case language
        case description
        case coverUrl = "cover_url"
    }
}

