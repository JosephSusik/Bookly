"use client";

import AuthLayout from "@/components/general/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyBooksPage() {
    return (
        <AuthLayout>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
                <p className="text-gray-600">Manage your personal book collection.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Books</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Your book collection will appear here.</p>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}

