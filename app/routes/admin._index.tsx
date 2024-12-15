import { useLoaderData } from "@remix-run/react";
import { db } from "~/services/database-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import moment from "moment";

export async function loader() {
  const requests = await db.getUserRequests();
  return { requests };
}

export default function AdminRequest() {
  const { requests } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Welcome to Admin Dashboard</h1>
              <p className="text-gray-400 max-w-2xl">
                Monitor and manage all vehicle import calculation requests. Get
                insights into user submissions and track important metrics all
                in one place.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-4 bg-neutral-800 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">
                    {requests.length}
                  </p>
                  <p className="text-sm text-gray-400">Total Requests</p>
                </div>
                <div className="w-px h-12 bg-neutral-700" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">
                    {
                      requests
                        .slice(0, 10)
                        .filter(
                          (r) =>
                            new Date(r.createdAt).toDateString() ===
                            new Date().toDateString()
                        ).length
                    }
                  </p>
                  <p className="text-sm text-gray-400">Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">
                All time submissions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today&apos;s Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  requests.filter(
                    (r) =>
                      new Date(r.createdAt).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Submissions in the last 24h
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Latest Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.length > 0
                  ? moment(requests[0].createdAt).format("MMM DD, yyyy HH:mm")
                  : "No requests"}
              </div>
              <p className="text-xs text-muted-foreground">
                Most recent submission
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const fields = JSON.parse(request.fields);
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        {moment(request.createdAt).format("MMM DD, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.phone}</TableCell>
                      <TableCell>{request.sectionId}</TableCell>
                      <TableCell>
                        <details className="cursor-pointer">
                          <summary className="text-sm text-blue-600 hover:text-blue-800">
                            View Fields
                          </summary>
                          <div className="mt-2 text-sm">
                            <pre className="bg-gray-50 p-2 rounded-md overflow-auto">
                              {JSON.stringify(fields, null, 2)}
                            </pre>
                          </div>
                        </details>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
