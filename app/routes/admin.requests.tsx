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
import { FinalCalculator } from "~/components/final-calculator";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { UserRequest } from "@prisma/client";

export async function loader() {
  const requests = await db.getUserRequests();
  const sections = await db.getSections();
  const fields = await db.getFields();
  return { requests, sections, fields };
}

export default function AdminRequest() {
  const { requests, sections, fields } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(
    null
  );
  console.log("fields", fields);
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
                        <Button
                          onClick={() => {
                            setSelectedRequest(request);
                            setOpen(true);
                          }}
                        >
                          Proceed to Calculator
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <FinalCalculator
              open={open}
              close={() => setOpen(false)}
              userFields={selectedRequest}
              allFields={fields}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
