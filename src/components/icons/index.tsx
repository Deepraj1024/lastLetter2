import { type FC, useMemo } from "react";
import { View } from "react-native";
import type { SvgProps } from "react-native-svg";
import type { ClassNameValue } from "tailwind-merge";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const icon = tv({
  compoundVariants: [
    {
      className: { icon: "text-default-foreground", wrapper: "bg-default" },
      color: "default",
      variants: "solid",
    },
    {
      className: { icon: "text-accent-foreground", wrapper: "bg-accent" },
      color: "accent",
      variants: "solid",
    },
    {
      className: { icon: "text-warning-foreground", wrapper: "bg-warning" },
      color: "warning",
      variants: "solid",
    },
    {
      className: { icon: "text-danger-foreground", wrapper: "bg-danger" },
      color: "danger",
      variants: "solid",
    },
    {
      className: { icon: "text-success-foreground", wrapper: "bg-success" },
      color: "success",
      variants: "solid",
    },
    {
      className: { icon: "text-background", wrapper: "bg-foreground" },
      color: "foreground",
      variants: "solid",
    },
    {
      className: { icon: "text-accent", wrapper: "bg-background" },
      color: "background",
      variants: "solid",
    },

    {
      className: { icon: "text-default", wrapper: "bg-transparent" },
      color: "default",
      variants: "transparent",
    },
    {
      className: { icon: "text-accent", wrapper: "bg-transparent" },
      color: "accent",
      variants: "transparent",
    },
    {
      className: { icon: "text-warning", wrapper: "bg-transparent" },
      color: "warning",
      variants: "transparent",
    },
    {
      className: { icon: "text-danger", wrapper: "bg-transparent" },
      color: "danger",
      variants: "transparent",
    },
    {
      className: { icon: "text-success", wrapper: "bg-transparent" },
      color: "success",
      variants: "transparent",
    },
    {
      className: { icon: "text-foreground", wrapper: "bg-transparent" },
      color: "foreground",
      variants: "transparent",
    },
    {
      className: { icon: "text-background", wrapper: "bg-transparent" },
      color: "background",
      variants: "transparent",
    },

    {
      className: {
        icon: "text-foreground",
        wrapper: "bg-foreground/50",
      },
      color: "default",
      variants: "soft",
    },
    {
      className: {
        icon: "text-accent-soft-foreground",
        wrapper: "bg-accent-soft",
      },
      color: "accent",
      variants: "soft",
    },
    {
      className: {
        icon: "text-warning-soft-foreground",
        wrapper: "bg-warning-soft",
      },
      color: "warning",
      variants: "soft",
    },
    {
      className: {
        icon: "text-danger-soft-foreground",
        wrapper: "bg-danger-soft",
      },
      color: "danger",
      variants: "soft",
    },
    {
      className: {
        icon: "text-success-soft-foreground",
        wrapper: "bg-success-soft",
      },
      color: "success",
      variants: "soft",
    },
    {
      className: { icon: "text-foreground", wrapper: "bg-foreground/20" },
      color: "foreground",
      variants: "soft",
    },
    {
      className: { icon: "text-background", wrapper: "bg-background/20" },
      color: "background",
      variants: "soft",
    },
    { className: { wrapper: "rounded-xl" }, rounded: "square", size: "sm" },
    { className: { wrapper: "rounded-2xl" }, rounded: "square", size: "md" },
    { className: { wrapper: "rounded-3xl" }, rounded: "square", size: "lg" },
    { className: { wrapper: "rounded-lg" }, rounded: "square", size: "xs" },
  ],
  defaultVariants: {
    color: "default",
    rounded: "full",
    size: "md",
    variants: "solid",
  },
  slots: { icon: "", wrapper: "items-center justify-center" },
  variants: {
    color: {
      accent: { icon: "", wrapper: "" },
      background: { icon: "", wrapper: "" },
      danger: { icon: "", wrapper: "" },
      default: { icon: "", wrapper: "" },
      foreground: { icon: "", wrapper: "" },
      success: { icon: "", wrapper: "" },
      warning: { icon: "", wrapper: "" },
    },
    rounded: {
      full: { wrapper: "rounded-full" },
      square: { wrapper: "" },
    },
    size: {
      lg: { icon: "size-8", wrapper: "p-4" },
      md: { icon: "size-6", wrapper: "p-3" },
      sm: { icon: "size-5", wrapper: "p-2" },
      xs: { icon: "size-3", wrapper: "p-1" },
    },
    variants: {
      soft: { icon: "text-accent", wrapper: "bg-accent/20" },
      solid: { icon: "text-white", wrapper: "bg-accent" },
      transparent: { icon: "", wrapper: "bg-transparent" },
    },
  },
});

interface IconProps extends VariantProps<typeof icon> {
  className?: ClassNameValue;
  icon: FC<SvgProps>;
  iconClassName?: ClassNameValue;
  withWrapper?: boolean;
}

export const Icon: FC<IconProps> = (props) => {
  const IconComp = props.icon;
  const withWrapper = useMemo(
    () => props?.withWrapper ?? true,
    [props?.withWrapper]
  );

  if (!withWrapper) {
    return (
      <IconComp
        className={icon({
          className: props.iconClassName,
          color: props.color,
          rounded: props.rounded,
          size: props.size,
          variants: props.variants,
        }).icon()}
      />
    );
  }

  return (
    <View
      className={icon({
        className: props.className,
        color: props.color,
        rounded: props.rounded,
        size: props.size,
        variants: props.variants,
      }).wrapper()}
    >
      <IconComp
        className={icon({
          className: props.iconClassName,
          color: props.color,
          rounded: props.rounded,
          size: props.size,
          variants: props.variants,
        }).icon()}
      />
    </View>
  );
};
