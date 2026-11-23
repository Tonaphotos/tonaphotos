import { Button, Flex, Text } from "@sanity/ui";
import { useRef, useState, type ChangeEvent } from "react";
import { insert, setIfMissing, useClient, type ArrayOfObjectsInputProps } from "sanity";

const batchSize = 5;

function uniqueKey() {
  return Math.random().toString(36).slice(2, 12);
}

export function BulkImageInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const picker = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [failed, setFailed] = useState(0);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    event.target.value = "";
    if (files.length === 0) return;
    props.onChange(setIfMissing([]));
    setFailed(0);
    setProgress({ done: 0, total: files.length });
    for (let start = 0; start < files.length; start += batchSize) {
      const slice = files.slice(start, start + batchSize);
      const results = await Promise.allSettled(
        slice.map((file) => client.assets.upload("image", file, { filename: file.name })),
      );
      const items = results.flatMap((result) =>
        result.status === "fulfilled"
          ? [{ _type: "image", _key: uniqueKey(), asset: { _type: "reference", _ref: result.value._id } }]
          : [],
      );
      setFailed((count) => count + results.length - items.length);
      if (items.length > 0) props.onChange(insert(items, "after", [-1]));
      setProgress({ done: Math.min(start + slice.length, files.length), total: files.length });
    }
    setProgress(null);
  }

  return (
    <Flex direction="column" gap={3}>
      {props.renderDefault(props)}
      <input ref={picker} type="file" accept="image/*" multiple hidden onChange={upload} />
      <Flex align="center" gap={3}>
        <Button
          mode="ghost"
          text={progress ? `Uploading ${progress.done} / ${progress.total}…` : "Upload multiple images"}
          disabled={Boolean(progress) || props.readOnly}
          onClick={() => picker.current?.click()}
        />
        {failed > 0 && (
          <Text size={1} muted>
            {failed} could not be uploaded
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
