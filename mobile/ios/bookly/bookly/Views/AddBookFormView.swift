//
//  AddBookFormView.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import SwiftUI

struct AddBookFormView: View {
    let searchResult: SearchByISBNResponse
    let onSave: (CreateBookData) -> Void
    let onCancel: () -> Void
    
    @State private var isbn: String
    @State private var title: String
    @State private var subtitle: String
    @State private var authors: String
    @State private var publisher: String
    @State private var publishedDate: Date?
    @State private var pageCount: String
    @State private var language: String
    @State private var description: String
    @State private var showDatePicker = false
    
    init(searchResult: SearchByISBNResponse, onSave: @escaping (CreateBookData) -> Void, onCancel: @escaping () -> Void) {
        self.searchResult = searchResult
        self.onSave = onSave
        self.onCancel = onCancel
        
        let book = searchResult.book
        _isbn = State(initialValue: book.ISBN ?? "")
        _title = State(initialValue: book.title ?? "")
        _subtitle = State(initialValue: book.subtitle ?? "")
        _authors = State(initialValue: (book.authors ?? []).joined(separator: ", "))
        _publisher = State(initialValue: book.publisher ?? "")
        _pageCount = State(initialValue: book.pageCount.map { String($0) } ?? "")
        _language = State(initialValue: book.language ?? "")
        _description = State(initialValue: book.description ?? "")
        
        // Try to parse published date
        if let dateString = book.publishedDate {
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withFullDate, .withDashSeparatorInDate]
            if let date = formatter.date(from: dateString) {
                _publishedDate = State(initialValue: date)
            } else {
                // Try alternative format
                let altFormatter = DateFormatter()
                altFormatter.dateFormat = "yyyy-MM-dd"
                if let date = altFormatter.date(from: dateString) {
                    _publishedDate = State(initialValue: date)
                } else {
                    _publishedDate = State(initialValue: nil)
                }
            }
        } else {
            _publishedDate = State(initialValue: nil)
        }
    }
    
    var body: some View {
        Form {
            Section(header: Text("Book Information")) {
                // ISBN
                HStack {
                    Text("ISBN")
                    Spacer()
                    TextField("ISBN", text: $isbn)
                        .disabled(isFieldDisabled("ISBN"))
                        .multilineTextAlignment(.trailing)
                }
                
                // Title
                VStack(alignment: .leading, spacing: 4) {
                    Text("Title *")
                    TextField("Book title", text: $title)
                        .disabled(isFieldDisabled("title"))
                }
                
                // Subtitle
                VStack(alignment: .leading, spacing: 4) {
                    Text("Subtitle")
                    TextField("Book subtitle", text: $subtitle)
                        .disabled(isFieldDisabled("subtitle"))
                }
                
                // Authors
                VStack(alignment: .leading, spacing: 4) {
                    Text("Authors")
                    TextField("Comma-separated authors", text: $authors)
                        .disabled(isFieldDisabled("authors"))
                }
                
                // Publisher
                VStack(alignment: .leading, spacing: 4) {
                    Text("Publisher")
                    TextField("Publisher", text: $publisher)
                        .disabled(isFieldDisabled("publisher"))
                }
                
                // Published Date
                VStack(alignment: .leading, spacing: 4) {
                    Text("Published Date")
                    Button(action: {
                        if !isFieldDisabled("published_date") {
                            showDatePicker.toggle()
                        }
                    }) {
                        HStack {
                            Text(publishedDate != nil ? formatDate(publishedDate!) : "Pick a date")
                                .foregroundColor(publishedDate != nil ? .primary : .secondary)
                            Spacer()
                            Image(systemName: "calendar")
                        }
                    }
                    .disabled(isFieldDisabled("published_date"))
                }
                
                if showDatePicker && !isFieldDisabled("published_date") {
                    DatePicker(
                        "Published Date",
                        selection: Binding(
                            get: { publishedDate ?? Date() },
                            set: { publishedDate = $0 }
                        ),
                        displayedComponents: .date
                    )
                    .datePickerStyle(.compact)
                }
                
                // Page Count
                VStack(alignment: .leading, spacing: 4) {
                    Text("Page Count")
                    TextField("Number of pages", text: $pageCount)
                        .keyboardType(.numberPad)
                        .disabled(isFieldDisabled("page_count"))
                }
                
                // Language
                VStack(alignment: .leading, spacing: 4) {
                    Text("Language")
                    TextField("Language", text: $language)
                        .disabled(isFieldDisabled("language"))
                }
                
                // Description
                VStack(alignment: .leading, spacing: 4) {
                    Text("Description")
                    TextEditor(text: $description)
                        .frame(minHeight: 100)
                        .disabled(isFieldDisabled("description"))
                }
            }
            
            Section {
                Button(action: handleSave) {
                    HStack {
                        Spacer()
                        Text("Save Book")
                            .fontWeight(.semibold)
                        Spacer()
                    }
                }
                .disabled(title.isEmpty)
                
                Button(action: onCancel) {
                    HStack {
                        Spacer()
                        Text("Cancel")
                            .foregroundColor(.red)
                        Spacer()
                    }
                }
            }
        }
        .navigationTitle("Add Book")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func isFieldDisabled(_ fieldName: String) -> Bool {
        searchResult.disabledFields.contains(fieldName)
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .long
        return formatter.string(from: date)
    }
    
    private func handleSave() {
        let authorsArray = authors
            .split(separator: ",")
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
        
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withFullDate, .withDashSeparatorInDate]
        
        let bookData = CreateBookData(
            ISBN: isbn.isEmpty ? nil : isbn,
            title: title,
            subtitle: subtitle.isEmpty ? nil : subtitle,
            authors: authorsArray.isEmpty ? nil : Array(authorsArray),
            publisher: publisher.isEmpty ? nil : publisher,
            publishedDate: publishedDate != nil ? formatter.string(from: publishedDate!) : nil,
            pageCount: Int(pageCount),
            language: language.isEmpty ? nil : language,
            description: description.isEmpty ? nil : description,
            coverUrl: nil
        )
        
        onSave(bookData)
    }
}

#Preview {
    NavigationView {
        AddBookFormView(
            searchResult: SearchByISBNResponse(
                source: "google_books",
                book: BookData(
                    ISBN: "1234567890",
                    title: "Sample Book",
                    subtitle: "A Sample",
                    authors: ["Author One", "Author Two"],
                    publisher: "Sample Publisher",
                    publishedDate: nil,
                    pageCount: 300,
                    language: "en",
                    description: "A sample book description",
                    coverUrl: nil
                ),
                disabledFields: []
            ),
            onSave: { _ in },
            onCancel: { }
        )
    }
}

