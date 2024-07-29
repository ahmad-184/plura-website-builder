import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertOctagonIcon } from "lucide-react";
import { Button } from "../ui/button";
import ButtonWithLoaderAndProgress from "../ButtonWithLoaderAndProgress";
import { Input } from "../ui/input";
import CustomDialog from "../custom/custom-dialog";
import { Agency } from "@prisma/client";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useServerAction } from "zsa-react";
import { deleteAgencyAction } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteAgency({ data }: { data: Partial<Agency> }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState(false);
  const router = useRouter();

  const { execute: deleteAgency, isPending } = useServerAction(
    deleteAgencyAction,
    {
      onSuccess: () => {
        toast.success("Agency deleted successfully");
        router.push("/agency");
      },
      onError: () => toast.error("Could not delete agency"),
      retry: {
        maxAttempts: 3,
      },
    }
  );

  const handleDelete = async () => {
    if (!data.id) return;
    if (!inputRef.current) return;
    const input = inputRef.current.value;
    if (input !== data.name) return setError(true);
    await deleteAgency({ agencyId: data.id });
  };

  return (
    <div className="w-full">
      <Alert variant={"destructive"} className="dark:text-rose-600">
        <AlertOctagonIcon className="dark:text-rose-600" size={20} />
        <div>
          <AlertTitle className="mt-[3px]">Danger zone</AlertTitle>
          <AlertDescription className="dark:text-rose-400">
            Deleting your agency cannot be undone. This will also delete all sub
            accounts and all data related to your sub accounts. Sub accounts
            will no longer have access to funnels, contacts etc.
          </AlertDescription>
          <div className="w-full mt-3">
            <CustomDialog
              header={"Confirm deletion of Agency"}
              description={
                "Deleting your agency cannot be undone. This will also delete all sub accounts and all data related to your sub accounts. Sub accounts will no longer have access to funnels, contacts etc."
              }
              content={
                <>
                  <div className="flex w-full flex-col gap-4">
                    <div className="dark:text-gray-600 flex gap-1 text-sm text-gray-500">
                      Type{" "}
                      <p className="dark:text-gray-400 text-gray-800 font-semibold">
                        {data.name}
                      </p>{" "}
                      to confirm
                    </div>
                    <div className="w-full flex gap-1 flex-col">
                      <Input
                        ref={inputRef}
                        autoFocus
                        placeholder={"type agency name here"}
                        className={cn({
                          "border-rose-600": error,
                        })}
                      />
                    </div>
                    <ButtonWithLoaderAndProgress
                      loading={isPending}
                      variant={"destructive"}
                      disabled={isPending}
                      className="text-rose-500 border border-rose-600 bg-rose-600/10 dark:bg-rose-600/10
                      hover:bg-rose-600/40
                    "
                      onClick={handleDelete}
                    >
                      I understand, delete Agency
                    </ButtonWithLoaderAndProgress>
                  </div>
                </>
              }
            >
              <Button variant={"outline"} className="">
                Delete Agency
              </Button>
            </CustomDialog>
          </div>
        </div>
      </Alert>
    </div>
  );
}
