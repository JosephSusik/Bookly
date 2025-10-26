"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { BookOpen, TrendingUp, Users, Star } from "lucide-react";
import Header from "@/components/general/Header";
import DataGrid, { columns, getData } from "@/components/general/DataGrid";

export default function DashboardPage() {
    const data = getData()

    return (
        <div className="min-h-screen max-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="h-[calc(100vh-56px)] max-w-7xl mx-auto w-full py-6 sm:px-6 lg:px-8 flex flex-col">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                    <p className="text-gray-600">Here's what's happening with your book collection.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">
                                +2 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Books Read</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18</div>
                            <p className="text-xs text-muted-foreground">
                                +3 from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Currently Reading</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">
                                In progress
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Reading Goal</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">75%</div>
                            <p className="text-xs text-muted-foreground">
                                18 of 24 books
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <DataGrid columns={columns} data={data} />
            </main>
        </div>
    );
}
