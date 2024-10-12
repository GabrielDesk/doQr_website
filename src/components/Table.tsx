// src/components/Table.tsx

import Image from "next/image";
import React, { ReactNode } from "react";

interface IActionsTable {
  func: () => void;
  icon: ReactNode; // Icon for the action
  name: string;
}

interface ITable<T = unknown> {
  head: string[]; // Array of header strings
  rows: T[]; // Array of rows, where each row is an object
  shouldHaveActions: boolean;
  actions: (row: T) => IActionsTable[]; // Array of actions
  isLoading: boolean; // Prop to control loading state
}

const shimmerLoading = (
  isLoading: boolean,
  head_items: string[],
  shouldHaveActions: boolean
) => (
  <table className="w-full min-w-max table-auto text-left">
    <thead className="rounded-xl bg-blue-gray-50">
      {isLoading ? (
        // Display loading skeleton headers
        <tr className="animate-pulse">
          {Array.from({ length: head_items?.length || 6 }).map(
            (_, cellIndex) => (
              <th
                key={cellIndex}
                className="p-4 border-b bg-text/10 border-blue-gray-100"
              >
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </th>
            )
          )}
        </tr>
      ) : (
        <></>
      )}
    </thead>

    <tbody>
      {isLoading ? (
        Array.from({ length: 5 }).map((_, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            {Array.from({ length: head_items.length || 5 }).map(
              (_, cellIndex) => (
                <td
                  key={cellIndex}
                  className="p-4 border-b border-blue-gray-100"
                >
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
              )
            )}
            {shouldHaveActions && (
              <td className="p-4 border-b border-blue-gray-100">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </td>
            )}
          </tr>
        ))
      ) : (
        <></>
      )}
    </tbody>
  </table>
);

export const Table = <T extends Record<string, unknown>>({
  head,
  rows,
  shouldHaveActions,
  actions,
  isLoading,
}: ITable<T>) => {
  return (
    <div className="w-full rounded-lg border-2 border-text/25">
      {isLoading && shimmerLoading(isLoading, head, shouldHaveActions)}
      {Array.isArray(rows) && rows.length === 0 && !isLoading && (
        <>
          <div className="flex flex-1 gap-5 flex-col h-96 items-center justify-center">
            <Image
              className="text-background flex p-2 rounded-lg bg-primary font-bold"
              alt="doQr_logo"
              src={"https://www.doqr.com.br/icons/logoHeader.svg"}
              width="230"
              height="230"
            />
            <h1 className="text-text/50 font-bold text-2xl">
              <u>SEM DADOS</u>
            </h1>
          </div>
        </>
      )}

      {!isLoading && rows.length > 0 && (
        <table className="w-full min-w-max table-auto text-left">
          <thead className="rounded-xl bg-blue-gray-50">
            {/* Display actual table headers */}
            <tr className="rounded-xl h-[0.5rem]">
              {head.map((heads) => (
                <th
                  key={heads}
                  className="border-b-2 bg-text/10 text-center border-text/15 p-4"
                >
                  <h1 className="text-text/70 text-sm">{heads}</h1>
                </th>
              ))}
              {shouldHaveActions && (
                <th className="border-b-2 bg-text/10 border-text/15 p-4">
                  <h1 className="text-text/70 text-sm">Ações</h1>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const isLast = index === rows.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-100";

              return (
                <tr key={index}>
                  {Object.entries(row)
                    .filter(
                      ([key, value]) =>
                        key !== "employeeId" &&
                        key !== "status" &&
                        key !== "employeeContractType" &&
                        value !== null
                    )
                    .map(([key, value], idx) => (
                      <td key={idx} className={`${classes}`}>
                        <h1
                          className={`text-text text-sm text-center font-medium ${
                            key === "displayStatus" && value === "Ativo"
                              ? "bg-green-200 text-green-900 rounded-xl text-center"
                              : key === "displayStatus" && value === "Inativo"
                              ? "bg-red-200 text-red-900 rounded-xl text-center"
                              : ""
                          }`}
                        >
                          {String(value)}
                        </h1>
                      </td>
                    ))}
                  {shouldHaveActions && (
                    <td
                      key={`action`}
                      className={`${classes} flex-row flex gap-3`}
                    >
                      {actions(row).map((item, actionIndex) => (
                        <div
                          key={actionIndex}
                          onClick={() => item.func()}
                          className="flex gap-2 text-text/30 flex-row cursor-pointer"
                        >
                          {item.icon}
                        </div>
                      ))}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

// import Image from "next/image";
// import React, { ReactNode } from "react";

// interface IActionsTable {
//   func: () => void;
//   icon: ReactNode; // Icon for the action
//   name: string;
// }

// interface ITable<T = unknown> {
//   head: string[]; // Array of header strings
//   rows: T[]; // Array of rows, where each row is an object
//   shouldHaveActions: boolean;
//   actions: (row: T) => IActionsTable[]; // Array of actions
//   isLoading: boolean; // Prop to control loading state
// }

// const shimmerLoading = (
//   isLoading: boolean,
//   head_items: string[],
//   shouldHaveActions: boolean
// ) => (
//   <table className="w-full min-w-max table-auto text-left">
//     <thead className="rounded-xl bg-blue-gray-50">
//       {isLoading ? (
//         // Display loading skeleton headers
//         <tr className="animate-pulse">
//           {Array.from({ length: head_items?.length || 6 }).map(
//             (_, cellIndex) => (
//               <th
//                 key={cellIndex}
//                 className="p-4 border-b bg-text/10 border-blue-gray-100"
//               >
//                 <div className="h-4 bg-gray-300 rounded w-full"></div>
//               </th>
//             )
//           )}
//           {/* {shouldHaveActions && (
//               <th className="p-4 border-b border-blue-gray-100">
//                 <div className="h-4 bg-gray-300 rounded w-full"></div>
//               </th>
//             )} */}
//         </tr>
//       ) : (
//         <></>
//       )}
//     </thead>

//     <tbody>
//       {isLoading ? (
//         Array.from({ length: 5 }).map((_, rowIndex) => (
//           <tr key={rowIndex} className="animate-pulse">
//             {Array.from({ length: head_items.length || 5 }).map(
//               (_, cellIndex) => (
//                 <td
//                   key={cellIndex}
//                   className="p-4 border-b border-blue-gray-100"
//                 >
//                   <div className="h-4 bg-gray-300 rounded w-full"></div>
//                 </td>
//               )
//             )}
//             {shouldHaveActions && (
//               <td className="p-4 border-b border-blue-gray-100">
//                 <div className="h-4 bg-gray-300 rounded w-full"></div>
//               </td>
//             )}
//           </tr>
//         ))
//       ) : (
//         <></>
//       )}
//     </tbody>
//   </table>
// );

// export const Table = <T extends Record<string, unknown>>({
//   head,
//   rows,
//   shouldHaveActions,
//   actions,
//   isLoading,
// }: ITable<T>) => {
//   return (
//     <div className="w-full rounded-lg border-2 border-text/25">
//       {isLoading && shimmerLoading(isLoading, head, shouldHaveActions)}
//       {Array.isArray(rows) && rows.length === 0 && !isLoading && (
//         <>
//           <div className="flex flex-1 gap-5 flex-col h-96 items-center justify-center">
//             <Image
//               className="text-background flex p-2 rounded-lg bg-primary font-bold"
//               alt="doQr_logo"
//               src={"https://www.doqr.com.br/icons/logoHeader.svg"}
//               width="230"
//               height="230"
//             />
//             <h1 className="text-text/50 font-bold text-2xl">
//               <u>SEM DADOS</u>
//             </h1>
//           </div>
//         </>
//       )}

//       {!isLoading && rows.length > 0 && (
//         <table className="w-full min-w-max table-auto text-left">
//           <thead className="rounded-xl bg-blue-gray-50">
//             {/* // Display actual table headers */}
//             <tr className="rounded-xl h-[0.5rem]">
//               {head.map((heads) => (
//                 <th
//                   key={heads}
//                   className="border-b-2 bg-text/10 text-center border-text/15 p-4"
//                 >
//                   <h1 className="text-text/70 text-sm">{heads}</h1>
//                 </th>
//               ))}
//               {shouldHaveActions && !isLoading && (
//                 <th className="border-b-2 bg-text/10 border-text/15 p-4">
//                   <h1 className="text-text/70 text-sm">Ações</h1>
//                 </th>
//               )}
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((row, index) => {
//               const isLast = index === rows.length - 1;
//               const classes = isLast
//                 ? "p-4"
//                 : "p-4 border-b border-blue-gray-100";

//               return (
//                 <tr key={index}>
//                   {Object.entries(row)
//                     .filter(
//                       ([key, value]) => key !== "employeeId" && value !== null
//                     )
//                     .map(([key, value], idx) => (
//                       <td key={idx} className={`${classes} `}>
//                         <h1
//                           className={`text-text text-sm text-center font-medium ${
//                             key === "displayStatus" && value === "Ativo"
//                               ? "bg-green-200 text-green-900 rounded-xl text-center"
//                               : key === "displayStatus" && value === "Inativo"
//                               ? "bg-red-200 text-red-900 rounded-xl text-center"
//                               : ""
//                           }`}
//                         >
//                           {String(value)}
//                         </h1>
//                       </td>
//                     ))}
//                   {shouldHaveActions && (
//                     <td
//                       key={`action`}
//                       className={`${classes} flex-row  flex gap-3`}
//                     >
//                       {actions(row).map((item, actionIndex) => (
//                         <div
//                           key={actionIndex}
//                           onClick={() => item.func()}
//                           className="flex gap-2 text-text/30 flex-row cursor-pointer"
//                         >
//                           {item.icon}
//                         </div>
//                       ))}
//                     </td>
//                   )}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };
