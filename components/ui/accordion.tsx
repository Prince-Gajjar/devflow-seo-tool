import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  activeValue: string | null;
  toggleValue: (value: string) => void;
} | null>(null);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single"; // For simplicity, only support single open accordion
  collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, type, collapsible, ...props }, ref) => {
    const [activeValue, setActiveValue] = React.useState<string | null>(null);

    const toggleValue = React.useCallback((value: string) => {
      setActiveValue((prev) => (prev === value ? null : value));
    }, []);

    return (
      <AccordionContext.Provider value={{ activeValue, toggleValue }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItemContext = React.createContext<string | null>(null);

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <AccordionItemContext.Provider value={value}>
        <div
          ref={ref}
          className={cn(
            "border border-card-border/60 bg-card/30 rounded overflow-hidden transition-all duration-200",
            className
          )}
          {...props}
        />
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const accordionContext = React.useContext(AccordionContext);
    const itemValue = React.useContext(AccordionItemContext);

    if (!accordionContext || itemValue === null) {
      throw new Error("AccordionTrigger must be used within Accordion and AccordionItem");
    }

    const isOpen = accordionContext.activeValue === itemValue;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex w-full items-center justify-between p-4 font-medium text-sm transition-all hover:bg-card-border/10 cursor-pointer text-left text-foreground",
          className
        )}
        onClick={() => accordionContext.toggleValue(itemValue)}
        aria-expanded={isOpen}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2",
            isOpen && "transform rotate-180 text-foreground"
          )}
        />
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const accordionContext = React.useContext(AccordionContext);
    const itemValue = React.useContext(AccordionItemContext);

    if (!accordionContext || itemValue === null) {
      throw new Error("AccordionContent must be used within Accordion and AccordionItem");
    }

    const isOpen = accordionContext.activeValue === itemValue;

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "p-4 pt-0 text-sm text-muted-foreground border-t border-card-border/20 bg-card/10 animate-fadeIn",
          className
        )}
        {...props}
      >
        <div className="pt-3">{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
