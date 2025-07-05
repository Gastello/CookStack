import { useTagsStore } from "../store/tagsStore";

export default function TagsTest() {
  const tagsLoading = useTagsStore((s) => s.loading);
  const tags = useTagsStore((s) => s.tags);

  const addTag = useTagsStore((s) => s.addTag);
  const updateTag = useTagsStore((s) => s.updateTag);
  const removeTag = useTagsStore((s) => s.removeTag);
  const getTagById = useTagsStore((s) => s.getTagById);
  return (
    <div>
      <div>
        {!tagsLoading
          ? tags.map((x) => (
              <div key={x.id}>
                {x.color} {x.text}
              </div>
            ))
          : ""}
      </div>
      <div className="*:p-2 flex gap-2 *:bg-amber-400">
        <button
          onClick={() => {
            const chars =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";
            const length = 10;
            for (let i = 0; i < length; i++) {
              result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            addTag(result, "#000000");
          }}
        >
          CREATE
        </button>
        <button
          onClick={() => {
            const id = tags[0].id;
            const tag = getTagById(id);
            if (tag) {
              updateTag({
                color: "#000000",
                id: id,
                text: tag.text === "Test" ? "Updated" : "Test",
              });
            }
          }}
        >
          UPDATE
        </button>
        <button
          onClick={() => {
            removeTag(tags[0].id);
          }}
        >
          DELETE
        </button>
      </div>
    </div>
  );
}
