import type { VariantProps } from "class-variance-authority";
import Loader from "./loader";
import { Button, buttonVariants } from "./ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  isUploading?: boolean;
  progress?: number;
}

const ButtonWithLoaderAndProgress: React.FC<Props> = ({
  loading,
  isUploading,
  progress,
  children,
  className,
  ...props
}) => {
  return (
    <Button className={cn("disabled:opacity-100", className)} {...props}>
      {!isUploading && loading ? <Loader className="w-7" /> : null}
      {isUploading ? (
        <div className="flex w-full items-center gap-1">
          <small className="text-muted dark:text-slate-300">{progress}%</small>
          <Progress value={progress} className="flex-grow" />
        </div>
      ) : null}
      {!isUploading && !loading ? children : null}
    </Button>
  );
};

export default ButtonWithLoaderAndProgress;
