export function Icon({ kind }: { kind: string }) {
  switch (kind) {
    case "function":
      return (
        <span class="rounded-full bg-sky-100 inline-block w-6 h-full mr-1 text-center">
          f
        </span>
      );
    case "interface":
      return (
        <span class="rounded-full bg-orange-50 text-orange-600 inline-block w-6 h-full mr-1 text-center">
          I
        </span>
      );
    case "typeAlias":
      return (
        <span class="rounded-full bg-red-50 text-red-600 inline-block w-6 h-full mr-1 text-center">
          T
        </span>
      );
    case "variable": {
      return (
        <span class="rounded-full bg-purple-200 text-violet-600 inline-block w-6 h-full mr-1 text-center">
          v
        </span>
      );
    }
  }
  return <></>;
}
