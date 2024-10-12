"use client";
import { Drawer } from "@/components/Drawer";
import { Table } from "@/components/Table";
import { EContractType } from "@/domains/contractType/models/contractType";
import { EStatus, IEmployee } from "@/domains/employee/models/employee";
import { EmployeeService } from "@/domains/employee/services/employee.service";
import { AsyncStorageState } from "@/models/Enums/EAsyncStorage";
import { TPageMode } from "@/models/Enums/EPageMode";
import { useAsyncStorage } from "@/utils/asyncStorage.utils";
import { formatDate } from "@/utils/date.utils";
import { formatRows } from "@/utils/table.utils";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GrAdd, GrEdit, GrTrash } from "react-icons/gr";

export default function Dashboard() {
  const router = useRouter();
  const { setStorageData } = useAsyncStorage();

  const [isLoadingEmployeeTable, setIsLoadingEmployeeTable] = useState(true);
  const [tableHeads, setTableHeads] = useState<string[]>([]);
  const [tableRows, setTableRows] = useState<Array<IEmployee>>([]);
  const [shouldShowDrawer, setShouldShowDrawer] = useState(false);
  const [fstBtn_fnc, setFstBtn_fnc] = useState<() => void>(() => {});
  const [scndBtn_func, setScndBtn_fnc] = useState<() => void>(() => {});
  const [drawerMessage, setDrawerMessage] = useState("");
  const [drawerTitleMessage, setDrawerTitleMessage] = useState("");
  const [disableDrawersButtons, setDisableDrawersButtons] = useState(false);
  const [queryEmployeeName, setQueryEmployeeName] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uniqueEmployee_tableKeys = [
    "Nome",
    "E-mail",
    "CPF",
    "Celular",
    "Data de nascimento",
    "Tipo de contratação",
    "Status",
  ];

  const actions = (rowData: IEmployee) => [
    {
      func: () =>
        handleOpenDrawer({
          message: `Tem certeza que deseja editar este funcionário? ${rowData.name}`,
          title: "Remover funcionário?",
          fstButtonAction: () => setShouldShowDrawer(false),
          scndButtonAction: () => {
            handleEditEmployee(rowData);
          },
        }),
      icon: <GrEdit />,
      name: "Edit",
    },
    {
      func: () =>
        handleOpenDrawer({
          message: `Tem certeza que deseja excluir este funcionário? ${rowData.name}`,
          title: "Remover funcionário?",
          fstButtonAction: () => setShouldShowDrawer(false),
          scndButtonAction: () => deleteEmployee(rowData.employeeId ?? ""),
        }),
      icon: <GrTrash />,
      name: "Remove",
    },
  ];

  useEffect(() => {
    async function Mount() {
      await fetchAllEmployees();
    }
    Mount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (queryEmployeeName === "") {
      fetchAllEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryEmployeeName]);

  useEffect(() => {
    setStorageData({
      id: AsyncStorageState.KEY_PAGEMODE,
      value: undefined,
    });
    setStorageData({
      id: AsyncStorageState.KEY_EMPLOYEE,
      value: {},
    });
  }, [tableHeads, tableRows, queryEmployeeName]);

  async function fetchAllEmployees() {
    setIsLoadingEmployeeTable(true);
    const response = await EmployeeService.getAll();

    if (response.success === true) {
      const allEmployees: IEmployee[] = response.allEmployees;

      setTableHeads(uniqueEmployee_tableKeys);

      const formattedRows = formatRows(allEmployees, {
        birthDate: (row: Record<string, unknown>) => {
          const date = row.birthDate as string;
          if (typeof date !== "string") return "";
          return formatDate(date); // Sua função existente para formatar datas
        },
        displayEmployeeContractType: (row: Record<string, unknown>) => {
          const type = row.employeeContractType as EContractType;
          if (type === EContractType.CLT) return "CLT";
          if (type === EContractType.PJ) return "PJ";
          return "";
        },
        displayStatus: (row: Record<string, unknown>) => {
          const status = row.status as EStatus;
          if (status === EStatus.Active) return "Ativo";
          if (status === EStatus.Inactive) return "Inativo";
          return "";
        },
      });
      setTableRows(formattedRows as []);
    } else {
      console.error(
        "Failed to fetch employees:",
        response.error || "Unknown error"
      );
    }
    setIsLoadingEmployeeTable(false);
  }

  async function fetchEmployeeByName() {
    setIsLoadingEmployeeTable(true);
    if (queryEmployeeName.length >= 3) {
      const response = await EmployeeService.getByName(queryEmployeeName);

      if (response.success) {
        const allEmployees: IEmployee[] = response.allEmployees;

        setTableHeads(uniqueEmployee_tableKeys);

        const formattedRows = formatRows(allEmployees, {
          birthDate: (row: Record<string, unknown>) => {
            const date = row.birthDate as string;
            if (typeof date !== "string") return "";
            return formatDate(date);
          },
          displayEmployeeContractType: (row: Record<string, unknown>) => {
            const type = row.employeeContractType as EContractType;
            if (type === EContractType.CLT) return "CLT";
            if (type === EContractType.PJ) return "PJ";
            return "";
          },
          displayStatus: (row: Record<string, unknown>) => {
            const status = row.status as EStatus;
            if (status === EStatus.Active) return "Ativo";
            if (status === EStatus.Inactive) return "Inativo";
            return "";
          },
        });

        setTableRows(formattedRows as []);
      } else {
        console.error(
          "Failed to fetch employees by name:",
          response.error || "Unknown error"
        );
      }
    }

    setIsLoadingEmployeeTable(false);
  }

  async function deleteEmployee(employeeId: string) {
    const response = await EmployeeService.delete(employeeId);

    if (response.success === true) {
      setDrawerMessage(response.message);
      setDrawerTitleMessage("");
      setDisableDrawersButtons(true);
      await fetchAllEmployees();
    } else {
      console.error(
        "Failed to delete employees:",
        response.error || "Unknown error"
      );
    }
    setDisableDrawersButtons(false);
    setShouldShowDrawer(false);
  }

  function handleEditEmployee(data: IEmployee) {
    setStorageData({
      id: AsyncStorageState.KEY_EMPLOYEE,
      value: data,
    });
    setStorageData({
      id: AsyncStorageState.KEY_EMPLOYEEID,
      value: data.employeeId,
    });
    setStorageData({
      id: AsyncStorageState.KEY_PAGEMODE,
      value: TPageMode.edit,
    });
    router.push("/employee");
  }

  function handleOpenDrawer({
    message,
    title,
    fstButtonAction,
    scndButtonAction,
  }: {
    message: string;
    title: string;
    fstButtonAction: () => void;
    scndButtonAction: () => void;
  }) {
    setShouldShowDrawer(true);
    setDrawerTitleMessage(title);
    setDrawerMessage(message);
    setFstBtn_fnc(() => fstButtonAction); // Set as function reference
    setScndBtn_fnc(() => scndButtonAction); // Set as function reference
  }

  function onEnterPressed(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      fetchEmployeeByName();
    }
  }

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] bg-background min-h-screen mt-1 mb-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-6 sm:items-start">
          1{" "}
          <div>
            <h1 className="text-text text-3xl font-bold">
              Controle de Funcionários
            </h1>
            <h3 className="text-text/50 text-1xl font-bold">
              Empresa DoQr tecnologia
            </h3>
          </div>
          {/* Table Area*/}
          <div className="w-full flex p-2 md:p-0 md:pb-5 flex-col gap-3">
            {/* Search Area*/}
            <div className="w-full flex flex-row items-center">
              <div className="w-[70%] flex flex-row gap-2 md:w-1/2">
                <input
                  onKeyDown={(e) =>
                    onEnterPressed(e as KeyboardEvent<HTMLInputElement>)
                  }
                  value={queryEmployeeName}
                  onChange={(text) => setQueryEmployeeName(text.target.value)}
                  className="border-2 p-2 text-text border-primary md:w-[70%] rounded-md"
                  placeholder="Buscar Funcionário..."
                />

                <div className="w-[20%] flex flex-row gap-2 md:w-1/2">
                  <button
                    onClick={() => fetchEmployeeByName()}
                    className="bg-primary p-2 items-center md:justify-evenly flex md:flex-initial border-2 md:w-2/6 rounded-md"
                  >
                    <FaMagnifyingGlass className="text-background text-xl md:text-xl" />
                  </button>
                </div>
              </div>

              <div className="w-[30%] md:w-1/2 flex justify-end">
                <button
                  onClick={() => {
                    setStorageData({
                      id: AsyncStorageState.KEY_PAGEMODE,
                      value: TPageMode.create,
                    });
                    router.push("/employee");
                  }}
                  className="bg-primary p-2 items-center md:justify-evenly flex md:flex-initial flex-row border-2 md:w-2/6 rounded-md gap-2"
                >
                  <GrAdd className="text-background text-2xl md:text-xl" />
                  <text className="font-bold hidden md:block">
                    {"Novo Funcionário"}
                  </text>
                  {/* <text className="font-bold md:hidden">{"Adicionar"}</text> */}
                </button>
              </div>
            </div>

            <div className="w-full flex flex-row items-center">
              <Table<IEmployee>
                actions={(rowData) => actions(rowData)}
                shouldHaveActions={true}
                head={tableHeads}
                rows={tableRows}
                isLoading={isLoadingEmployeeTable}
              />
            </div>
          </div>
        </main>
        <Drawer
          shouldOpen={shouldShowDrawer}
          onClose={() => setShouldShowDrawer(false)}
          message={drawerMessage}
          title_action={drawerTitleMessage}
          fstButton_fnc={fstBtn_fnc}
          scndButton_fnc={scndBtn_func}
          shoulDisableButtons={disableDrawersButtons}
        />
      </div>
    </>
  );
}
