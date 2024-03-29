"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRef } from "react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
  name: string,
  type: "file" | "folder",
  modified: number,
}


export function getColumns(editableRowId: number, saveNewFileName: any) {
  
  const editableKeyUpHandler = async (e: any) => {
    e.preventDefault()
    if (e.key == 'Enter') {
      e.preventDefault()
      saveNewFileName(e.target.innerText)
    }
  }

  const columns: ColumnDef<File>[] = [
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
                <span className={`cursor-pointer w-full outline-none ${editableRowId == row.index ? 'border-b border-gray-500 text-gray-700' : ''} py-1 px-3`} onKeyUp={editableKeyUpHandler} onClick={(e) => {if (editableRowId == row.index) {e.preventDefault()} }} contentEditable={editableRowId == row.index}>{ name }</span>
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
                    <div className="text-right">
                    <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Modified
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    </div>
                    )
                  },
                  cell: ({ row }) => {
                    const modified = parseFloat(row.getValue("modified"))
                    
                    let formatted: number | string = 0
                    
                    if (modified >= 365 * 24 * 60 * 60 * 1000) { // 365d
                      formatted = Math.round(modified / 1000 / 60 / 60 / 24 / 365)
                      formatted = `${formatted}y`
                    } else if (modified >= 7 * 24 * 60 * 60 * 1000) { // 365d
                      formatted = Math.round(modified / 1000 / 60 / 60 / 24 / 7)
                      formatted = `${formatted}w`
                    } else if (modified >= 24 * 60 * 60 * 1000) { // 24h
                      formatted = Math.round(modified / 1000 / 60 / 60 / 24)
                      formatted = `${formatted}d`
                    } else if (modified >= 60 * 60 * 1000) { // 60min
                      formatted = Math.round(modified / 1000 / 60 / 60)
                      formatted = `${formatted}h`
                    } else if (modified >= 60 * 1000) { // 60s
                      formatted = Math.round(modified / 1000 / 60)
                      formatted = `${formatted}m`
                    } else {
                      formatted = Math.round(modified / 1000)
                      formatted = `${formatted}s`
                    }
                    
                    return <div className="font-medium text-right pr-6">{formatted} ago</div>
                  },
                },
              ]
              
              return columns
            }