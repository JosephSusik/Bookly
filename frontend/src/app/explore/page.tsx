"use client";

import AuthLayout from "@/components/general/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExplorePage() {
    return (
        <AuthLayout>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Explore</h2>
                <p className="text-gray-600">Discover new books and expand your collection.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Discover Books</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Explore and discover new books here.</p>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}

