"use client";

export default function DataTable({

  columns = [],

  data = [],

  emptyState = null,

}) {

  return (

   <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            {columns.map((column) => (

              <th

                key={column.key}

                className="px-6 py-4 text-left text-sm font-semibold text-slate-700"

              >

                {column.title}

              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {data.length > 0 ? (

            data.map((row, index) => (

              <tr

                key={row._id || index}

                className="border-t border-slate-200 hover:bg-slate-50 transition-colors"

              >

                {columns.map((column) => (

                  <td

                    key={column.key}

                    className="px-6 py-4 text-sm text-slate-700"

                  >

                    {column.render

                      ? column.render(row)

                      : row[column.key]}

                  </td>

                ))}

              </tr>

            ))

          ) : (

            <tr>

              <td

                colSpan={columns.length}

                className="py-16 text-center"

              >

                {emptyState}

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}