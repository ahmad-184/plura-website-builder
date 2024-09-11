import { Input } from "@/components/ui/input";
import { useEditor } from "@/providers/editor-store-provider";
import { useEffect, useState } from "react";

export default function Dimensions({
  handleOnChange,
}: {
  handleOnChange: (e: any) => void;
}) {
  const selectedElement = useEditor((store) => store.editor.selectedElement);

  const [height, setHeight] = useState(selectedElement.styles.height || "");
  const [width, setWidth] = useState(selectedElement.styles.width || "");
  const [marginTop, setMarginTop] = useState(
    selectedElement.styles.marginTop || ""
  );
  const [marginBottom, setMarginBottom] = useState(
    selectedElement.styles.marginBottom || ""
  );
  const [marginLeft, setMarginLeft] = useState(
    selectedElement.styles.marginLeft || ""
  );
  const [marginRight, setMarginRight] = useState(
    selectedElement.styles.marginRight || ""
  );
  const [paddingTop, setPaddingTop] = useState(
    selectedElement.styles.paddingTop || ""
  );
  const [paddingBottom, setPaddingBottom] = useState(
    selectedElement.styles.paddingBottom || ""
  );
  const [paddingLeft, setPaddingLeft] = useState(
    selectedElement.styles.paddingLeft || ""
  );
  const [paddingRight, setPaddingRight] = useState(
    selectedElement.styles.paddingRight || ""
  );

  useEffect(() => {
    setHeight((selectedElement.styles.height as string) || "");
    setWidth((selectedElement.styles.width as string) || "");
    setMarginTop(selectedElement.styles.marginTop || "");
    setMarginBottom(selectedElement.styles.marginBottom || "");
    setMarginLeft(selectedElement.styles.marginLeft || "");
    setMarginRight(selectedElement.styles.marginRight || "");
    setPaddingTop(selectedElement.styles.paddingTop || "");
    setPaddingBottom(selectedElement.styles.paddingBottom || "");
    setPaddingLeft(selectedElement.styles.paddingLeft || "");
    setPaddingRight(selectedElement.styles.paddingRight || "");
  }, [selectedElement.styles]);

  return (
    <div className="gap-3 flex w-full flex-col">
      <div className="flex flex-row gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">Height</p>
          <Input
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              handleOnChange({
                target: {
                  id: "height",
                  value: e.target.value,
                },
              });
            }}
            placeholder="px"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">Width</p>
          <Input
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              handleOnChange({
                target: {
                  id: "width",
                  value: e.target.value,
                },
              });
            }}
            placeholder="px"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p>Margin</p>
        <div className="flex flex-row gap-3 mb-1">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Top</p>
            <Input
              value={marginTop}
              onChange={(e) => {
                setMarginTop(e.target.value);
                handleOnChange({
                  target: {
                    id: "marginTop",
                    value: e.target.value,
                  },
                });
              }}
              placeholder="px"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Bottom</p>
            <Input
              value={marginBottom}
              onChange={(e) => {
                setMarginBottom(e.target.value);
                handleOnChange({
                  target: {
                    id: "marginBottom",
                    value: e.target.value,
                  },
                });
              }}
              placeholder="px"
            />
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Left</p>
            <Input
              value={marginLeft}
              onChange={(e) => {
                setMarginLeft(e.target.value);
                handleOnChange({
                  target: {
                    id: "marginLeft",
                    value: e.target.value,
                  },
                });
              }}
              placeholder="px"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Right</p>
            <Input
              value={marginRight}
              onChange={(e) => {
                setMarginRight(e.target.value);
                handleOnChange({
                  target: {
                    id: "marginRight",
                    value: e.target.value,
                  },
                });
              }}
              placeholder="px"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p>Padding</p>
        <div className="flex flex-row gap-3 mb-1">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Top</p>
            <Input
              value={paddingTop}
              onChange={(e) => {
                setPaddingTop(e.target.value);
                handleOnChange({
                  target: {
                    id: "paddingTop",
                    value: e.target.value,
                  },
                });
              }}
              placeholder="px"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Bottom</p>
            <Input
              value={paddingBottom}
              onChange={(e) => {
                setPaddingBottom(e.target.value);
                handleOnChange({
                  target: {
                    id: "paddingBottom",
                    value: e.target.value,
                  },
                });
              }}
              placeholder="px"
            />
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Left</p>
            <Input
              value={paddingLeft}
              onChange={(e) => {
                setPaddingLeft(e.target.value);
                handleOnChange({
                  target: {
                    id: "paddingLeft",
                    value: e.target.value,
                  },
                });
              }}
              placeholder="px"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Right</p>
            <Input
              value={paddingRight}
              onChange={(e) => {
                setPaddingRight(e.target.value);
                handleOnChange({
                  target: {
                    id: "paddingRight",
                    value: e.target.value,
                  },
                });
              }}
              placeholder="px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
