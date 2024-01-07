"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
    name: string,
    type: "file" | "folder",
    modified: number
}

export const columns: ColumnDef<File>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name: string = row.getValue("name")

      return (
        <div className="cursor-pointer h-full w-full">{ name }</div>
      )
    },
    
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "modified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Modified x ago
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const modified = parseFloat(row.getValue("modified"))

      let formatted: number | string = 0
 
      if (modified > 365 * 24 * 60 * 60 * 1000) { // 365d
        formatted = Math.round(modified / 1000 / 60 / 60 / 24 / 365)
        formatted = `${formatted}y`
      } else if (modified > 7 * 24 * 60 * 60 * 1000) { // 365d
        formatted = Math.round(modified / 1000 / 60 / 60 / 24 / 7)
        formatted = `${formatted}w`
      } else if (modified > 24 * 60 * 60 * 1000) { // 24h
        formatted = Math.round(modified / 1000 / 60 / 60 / 24)
        formatted = `${formatted}d`
      } else if (modified > 60 * 60 * 1000) { // 60min
        formatted = Math.round(modified / 1000 / 60 / 60)
        formatted = `${formatted}h`
      } else if (modified > 60 * 1000) { // 60s
        formatted = Math.round(modified / 1000 / 60)
        formatted = `${formatted}m`
      } else {
        formatted = Math.round(modified / 1000)
        formatted = `${formatted}s`
      }

      return <div className="text-right font-medium">{formatted} ago</div>
    },
  },
]
