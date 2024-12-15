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
  const sections = await db.getSections();
  return { requests, sections };
}

export default function AdminRequest() {
  const { requests, sections } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      <div className=" mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Requests</h1>
          <p className="text-gray-500">
            View and manage all user import calculation requests
          </p>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
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
                      <TableCell>
                        {sections.find((s) => s.id === request.sectionId)?.name}
                      </TableCell>
                      <TableCell>
                        <details className="cursor-pointer">
                          <summary className="text-sm text-blue-600 hover:text-blue-800">
                            Proceed to Calculator
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
