//
//  MainTabView.swift
//  bookly
//
//  Created by Josef Susík on 08.11.2025.
//

import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Tab 1: My Books
            BooksListView()
                .tabItem {
                    Image(systemName: "books.vertical")
                    Text("My Books")
                }
                .tag(0)
            
            // Tab 2: Add Book (with scanner)
            AddBookView()
                .tabItem {
                    Image(systemName: "plus.circle.fill")
                    Text("Add")
                }
                .tag(1)
            
            // Tab 3: Profile
            ProfileView()
                .tabItem {
                    Image(systemName: "person.circle")
                    Text("Profile")
                }
                .tag(2)
        }
        .environmentObject(authManager)
    }
}

#Preview {
    MainTabView()
        .environmentObject(AuthManager())
}

