"use client";
import { Drawer } from "@/components/Drawer";
import { EContractType } from "@/domains/contractType/models/contractType";
import { EStatus, IEmployee } from "@/domains/employee/models/employee";
import { EmployeeService } from "@/domains/employee/services/employee.service";
import { AsyncStorageState } from "@/models/Enums/EAsyncStorage";
import { TPageMode } from "@/models/Enums/EPageMode";
import { useAsyncStorage } from "@/utils/asyncStorage.utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import InputMask from "react-input-mask";

export default function CreateEmployee() {
  const router = useRouter();
  const { getStorageData } = useAsyncStorage();

  const [formData, setFormData] = useState<Partial<IEmployee>>({});

  const [formValidity, setFormValidity] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({
    name: false,
    email: false,
    cpf: false,
    phone: false,
    birthDate: false,
    employeeContractType: false,
    status: false,
  });

  const [shouldShowDrawer, setShouldShowDrawer] = useState(false);
  const [drawerMessage, setDrawerMessage] = useState("");
  const [drawerTitleMessage, setDrawerTitleMessage] = useState("");
  const [fstBtnFunc, setFstBtnFunc] = useState<() => void>(() => {});
  const [scndBtnFunc, setScndBtnFunc] = useState<() => void>(() => {});
  const [pageMode, setPageMode] = useState<TPageMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstButtonText, setFirstButtonText] = useState("");
  const [SecondButtonText, setSecondButtonText] = useState("");

  const actionsButtons = [
    {
      type: "update",
      bgColor: "bg-primary",
      title: `${pageMode === TPageMode.create ? "Cadastrar" : "Salvar"}`,
      fnc: () => handleSubmit(),
    },
    {
      type: "delete",
      bgColor: "bg-red-600",
      title: "Excluir",
      fnc: (rowData: IEmployee) =>
        handleOpenDrawer({
          message: `Tem certeza que deseja excluir este funcionário? ${rowData.name}`,
          title: "Remover funcionário?",
          fstButtonAction: () => setShouldShowDrawer(false),
          scndButtonAction: () => deleteEmployee(rowData.employeeId as string),
        }),
    },
  ];

  // Regex patterns for validation
  const regexPatterns: { [key: string]: RegExp } = {
    text: /^[a-zA-Z\sÀ-ÿ]+$/,
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    phone: /^\(\d{2}\) \d{5}-\d{4}$/,
    date: /^\d{2}\/\d{2}\/\d{4}$/,
  };

  // Validate function
  const validateField = (type: string, value: string) => {
    const pattern = regexPatterns[type] || /.*/;
    return pattern.test(value);
  };

  useEffect(() => {
    return () => {};
  }, [formData]);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const employeeData: IEmployee = await getStorageData({
          id: AsyncStorageState.KEY_EMPLOYEE,
        });
        console.log({ employeeData });
        setFormData({
          employeeId: employeeData.employeeId,
          name: employeeData.name || "",
          email: employeeData.email || "",
          cpf: employeeData.cpf || "",
          phone: employeeData.phone || "",
          birthDate: employeeData.birthDate || "",
          status:
            employeeData.status === EStatus.Inactive
              ? EStatus.Inactive
              : EStatus.Active,
          employeeContractType:
            employeeData.employeeContractType === EContractType.CLT
              ? EContractType.CLT
              : EContractType.PJ,
        });

        console.log({ formData });

        const mode: TPageMode = await getStorageData({
          id: AsyncStorageState.KEY_PAGEMODE,
        });
        setPageMode(mode);

        // Validate initial data
        if (mode === TPageMode.edit) {
          setFormValidity({
            name: true,
            email: true,
            cpf: true,
            phone: true,
            birthDate: true,
            employeeContractType: true,
            status: true,
          });
        } else {
          setFormValidity({
            name: validateField("text", employeeData.name || ""),
            email: validateField("email", employeeData.email || ""),
            cpf: validateField("cpf", employeeData.cpf || ""),
            phone: validateField("phone", employeeData.phone || ""),
            birthDate: validateField("date", employeeData.birthDate || ""),
            employeeContractType: employeeData.employeeContractType
              ? true
              : false,
            status: employeeData.status ? true : false,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleInputChange = (key: keyof IEmployee, value: string) => {
    let parsedValue: string | number = value;

    // Converter para números se for um enum
    if (key === "employeeContractType" || key === "status") {
      parsedValue = parseInt(value, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [key]: parsedValue,
    }));

    // Determinar o tipo com base na chave
    const type = getFieldType(key as string);
    const isValid = validateField(type, value);

    setFormValidity((prev) => ({
      ...prev,
      [key]: isValid,
    }));
  };

  const handleBlur = (key: keyof IEmployee) => {
    setTouchedFields((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const getFieldType = (key: string): string => {
    switch (key) {
      case "name":
        return "text";
      case "email":
        return "email";
      case "cpf":
        return "cpf";
      case "phone":
        return "phone";
      case "birthDate":
        return "date";
      case "employeeContractType":
      case "status":
        return "select";
      default:
        return "text";
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Check overall form validity
    const isValid = Object.values(formValidity).every((valid) => valid);
    if (!isValid) {
      setDrawerMessage("Por favor, corrija os campos destacados.");
      setDrawerTitleMessage("Erro de Validação");
      handleOpenDrawer({
        message: "Por favor, corrija os campos destacados.",
        title: "Erro de Validação",
        fstButtonAction: () => setShouldShowDrawer(false),
        scndButtonAction: () => setShouldShowDrawer(false),
      });
      return;
    }

    // Prepare employee object
    const employeeObject: IEmployee = {
      ...formData,
      phone: formData.phone
        ?.replace("(", "")
        .replace(")", "")
        .replace(" ", "")
        .replace("-", ""),
      cpf: formData.cpf?.replaceAll(".", "").replace("-", ""),
      birthDate: formatDateForAPI(formData.birthDate as string),
      employeeContractType:
        formData.employeeContractType === EContractType.CLT
          ? EContractType.CLT
          : EContractType.PJ,
      status:
        formData.status === EStatus.Active ? EStatus.Active : EStatus.Inactive,
    } as IEmployee;

    try {
      let response;
      if (pageMode === TPageMode.create) {
        response = await EmployeeService.createEmployee(employeeObject);
      } else {
        response = await EmployeeService.updateEmployee(employeeObject);
      }

      if (response?.success) {
        handleOpenDrawer({
          message: `${response.message} Deseja voltar ao dashboard?`,
          title: "Operação",
          fstBtnText: "Não",
          scndBtnText: "Sim",
          fstButtonAction: () => setShouldShowDrawer(false),
          scndButtonAction: () => router.push("/"),
        });
      } else {
        handleOpenDrawer({
          message: response.message || "Ocorreu um erro.",
          title: "Operação",
          fstButtonAction: () => setShouldShowDrawer(false),
          scndButtonAction: () => setShouldShowDrawer(false),
        });
      }
    } catch (error) {
      console.error("Erro ao submeter o formulário:", error);
      handleOpenDrawer({
        message: "Ocorreu um erro inesperado.",
        fstBtnText: "Sair",
        scndBtnText: "Tentar novamente",
        title: "Erro",
        fstButtonAction: () => router.push("/"),
        scndButtonAction: () => setShouldShowDrawer(false),
      });
    }
  };

  async function deleteEmployee(employeeId: string) {
    const response = await EmployeeService.delete(employeeId);

    if (response.success === true) {
      router.push("/");
    } else {
      console.error(
        "Failed to delete employees:",
        response.error || "Unknown error"
      );
    }
  }

  const handleOpenDrawer = ({
    message,
    title,
    scndBtnText,
    fstBtnText,
    fstButtonAction,
    scndButtonAction,
  }: {
    message: string;
    title: string;
    scndBtnText?: string;
    fstBtnText?: string;
    fstButtonAction: () => void;
    scndButtonAction: () => void;
  }) => {
    setShouldShowDrawer(true);
    setDrawerTitleMessage(title);
    setDrawerMessage(message);
    setFirstButtonText(fstBtnText || "");
    setSecondButtonText(scndBtnText || "");
    setFstBtnFunc(() => fstButtonAction);
    setScndBtnFunc(() => scndButtonAction);
  };

  const formatDateForAPI = (dateStr: string): string => {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Replace with a spinner if desired
  }

  return (
    <div className="grid grid-rows-[20px_2fr_20px] bg-background min-h-screen mt-1 mb-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 p-6 mt-16 mb-16 md:mb-0 md:mt-0 md:p-4 ">
        <div className="flex flex-col gap-4 sm:items-start">
          <Link
            href="/"
            className="items-center md:justify-evenly gap-2 flex flex-row md:flex-initial "
          >
            <IoArrowBackSharp className="text-3xl text-primary" />
            <h3 className="text-text/50 text-1xl font-bold">Voltar</h3>
          </Link>

          <div className="flex flex-col gap-2 sm:items-start">
            <h1 className="text-text text-3xl font-bold">
              {pageMode === TPageMode.create
                ? "Criar Funcionário"
                : "Editar Funcionário"}
            </h1>
            <h3 className="text-text/50 text-1xl font-bold">
              Empresa DoQr tecnologia
            </h3>
          </div>
        </div>

        <div className="flex flex-col overflow-clip pb-10 md:pb-0 bg-background rounded-lg shadow-gray-200 shadow-lg w-full ">
          <form
            onSubmit={handleSubmit}
            className="w-full md:grid md:grid-cols-3 md:grid-rows-2 p-4 gap-2"
          >
            {/* Nome */}
            <div className="overflow-clip flex flex-col gap-1 mt-4">
              <label htmlFor="name" className="text-text text-xl font-semibold">
                Nome
              </label>
              <input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Nome"
                className={`border-2 p-2 text-text border-text/10 rounded-md ${
                  !formValidity.name && touchedFields.name
                    ? "border-red-800 border-3 animate-pulse"
                    : ""
                }`}
                type="text"
                maxLength={50}
              />
              {!formValidity.name && touchedFields.name && (
                <span className="text-red-500 text-sm">
                  Nome inválido. Apenas letras e espaços são permitidos.
                </span>
              )}
            </div>

            {/* E-mail */}
            <div className="overflow-clip flex flex-col gap-1 mt-4">
              <label
                htmlFor="email"
                className="text-text text-xl font-semibold"
              >
                E-mail
              </label>
              <input
                id="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="E-mail"
                className={`border-2 p-2 text-text border-text/10 rounded-md ${
                  !formValidity.email && touchedFields.email
                    ? "border-red-800 border-3 animate-pulse"
                    : ""
                }`}
                type="email"
                maxLength={100}
              />
              {!formValidity.email && touchedFields.email && (
                <span className="text-red-500 text-sm">E-mail inválido.</span>
              )}
            </div>

            {/* CPF */}
            <div className="overflow-clip flex flex-col gap-1 mt-4">
              <label htmlFor="cpf" className="text-text text-xl font-semibold">
                CPF
              </label>
              <InputMask
                id="cpf"
                mask="999.999.999-99"
                value={formData.cpf || ""}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                onBlur={() => handleBlur("cpf")}
                placeholder="CPF"
                className={`border-2 p-2 text-text border-text/10 rounded-md ${
                  !formValidity.cpf && touchedFields.cpf
                    ? "border-red-800 border-3 animate-pulse"
                    : ""
                }`}
              />
              {!formValidity.cpf && touchedFields.cpf && (
                <span className="text-red-500 text-sm">
                  CPF inválido. Deve estar no formato XXX.XXX.XXX-XX.
                </span>
              )}
            </div>

            {/* Celular */}
            <div className="overflow-clip flex flex-col gap-1 mt-4">
              <label
                htmlFor="phone"
                className="text-text text-xl font-semibold"
              >
                Celular
              </label>
              <InputMask
                id="phone"
                mask="(99) 99999-9999"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="(99) 99999-9999"
                className={`border-2 p-2 text-text border-text/10 rounded-md ${
                  !formValidity.phone && touchedFields.phone
                    ? "border-red-800 border-3 animate-pulse"
                    : ""
                }`}
              />
              {!formValidity.phone && touchedFields.phone && (
                <span className="text-red-500 text-sm">
                  Celular inválido. Deve estar no formato (XX) XXXXX-XXXX.
                </span>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="overflow-clip flex flex-col gap-1 mt-4">
              <label
                htmlFor="birthDate"
                className="text-text text-xl font-semibold"
              >
                Data de Nascimento
              </label>
              <InputMask
                id="birthDate"
                mask="99/99/9999"
                value={formData.birthDate || ""}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                onBlur={() => handleBlur("birthDate")}
                placeholder="DD/MM/AAAA"
                className={`border-2 p-2 text-text border-text/10 rounded-md ${
                  !formValidity.birthDate && touchedFields.birthDate
                    ? "border-red-800 border-3 animate-pulse"
                    : ""
                }`}
              />
              {!formValidity.birthDate && touchedFields.birthDate && (
                <span className="text-red-500 text-sm">
                  Data inválida. Deve estar no formato DD/MM/AAAA.
                </span>
              )}
            </div>

            {/* Tipo de contratação */}
            <div className="overflow-clip flex flex-col gap-1 mt-4">
              <label className="text-text text-xl font-semibold">
                Tipo de contratação
              </label>
              <select
                id="employeeContractType"
                value={formData.employeeContractType || ""}
                onChange={(e) =>
                  handleInputChange("employeeContractType", e.target.value)
                }
                onBlur={() => handleBlur("employeeContractType")}
                className={`border-2 p-2 text-text bg-background w-full border-text/10 rounded-md ${
                  !formValidity.employeeContractType &&
                  touchedFields.employeeContractType
                    ? "border-red-800 border-3 animate-pulse"
                    : ""
                }`}
              >
                <option value="" disabled>
                  Selecione uma opção...
                </option>
                <option value={EContractType.PJ}>PJ</option>
                <option value={EContractType.CLT}>CLT</option>
              </select>
              {!formValidity.employeeContractType &&
                touchedFields.employeeContractType && (
                  <span className="text-red-500 text-sm">
                    Por favor, selecione o tipo de contratação.
                  </span>
                )}
            </div>

            {/* Status */}
            <div className="overflow-clip flex flex-col gap-1 mt-4">
              <label
                htmlFor="status"
                className="text-text text-xl font-semibold"
              >
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                onBlur={() => handleBlur("status")}
                className={`border-2 p-2 text-text bg-background w-full border-text/10 rounded-md ${
                  !formValidity.status && touchedFields.status
                    ? "border-red-800 border-3 animate-pulse"
                    : ""
                }`}
              >
                <option value="" disabled>
                  Selecione uma opção...
                </option>
                <option value={EStatus.Inactive}>Inativo</option>
                <option value={EStatus.Active}>Ativo</option>
              </select>
              {!formValidity.status && touchedFields.status && (
                <span className="text-red-500 text-sm">
                  Por favor, selecione o status.
                </span>
              )}
            </div>
          </form>

          <div className="w-auto p-4 items-center gap-2 flex flex-row ">
            {actionsButtons.map((item, index) => (
              <button
                key={index}
                type="submit"
                disabled={!Object.values(formValidity).every((valid) => valid)}
                onClick={handleSubmit}
                className={`${item.bgColor} ${
                  pageMode === TPageMode.create && item.type === "delete"
                    ? "hidden"
                    : "block"
                } w-auto h-auto px-4 py-1 items-center md:justify-evenly flex flex-row rounded-md ${
                  !Object.values(formValidity).every((valid) => valid)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="font-bold block">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Drawer
        shouldOpen={shouldShowDrawer}
        onClose={() => setShouldShowDrawer(false)}
        message={drawerMessage}
        title_action={drawerTitleMessage}
        fstButton_text={firstButtonText}
        scndButton_text={SecondButtonText}
        fstButton_fnc={fstBtnFunc}
        scndButton_fnc={scndBtnFunc}
      />
    </div>
  );
}
