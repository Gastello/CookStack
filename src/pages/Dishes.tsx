import { useEffect } from "react";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";
import DishesDashboard from "../components/dishesDashboard/DishesDashboard";
import { useDishesStore } from "../store/dishedStore";
import Loader, { LOADER_EMOJIES } from "../components/loader/Loader";
import { useTagsStore } from "../store/tagsStore";

export default function Dishes() {
  const { dishes } = useDishesStore();
  const { fetchDishes } = useDishesStore();
  const { loading } = useDishesStore();
  const { addDish } = useDishesStore();
  const { fetchTags } = useTagsStore();

  const tagsLoading = useTagsStore((s) => s.loading);
  const tags = useTagsStore((s) => s.tags);

  const addTag = useTagsStore((s) => s.addTag);
  const updateTag = useTagsStore((s) => s.updateTag);
  const removeTag = useTagsStore((s) => s.removeTag);
  const getTagById = useTagsStore((s) => s.getTagById);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  return (
    <div className="relative flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="My Dishes"
        subtitle="Browse and manage your dish collection"
        btnText="Add Dish"
        btnIcon={EMOJI.forkAndKnife}
        btnEvent={addDish}
      />
      {loading ? (
        <Loader loading={true} size={256} name={LOADER_EMOJIES.forkAndKnife} />
      ) : dishes && dishes.length != 0 ? (
        <div>
          <DishesDashboard />
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
                  result += chars.charAt(
                    Math.floor(Math.random() * chars.length)
                  );
                }
                addTag(result, "#000000");
              }}
            >
              CREATE
            </button>
            <button
              onClick={() => {
                const tag = getTagById("a5963615-1ea5-434f-ade8-aa0282ff472f");
                if (tag) {
                  updateTag({
                    color: "#000000",
                    id: "a5963615-1ea5-434f-ade8-aa0282ff472f",
                    text: tag.text === "Test" ? "Updated" : "Test",
                  });
                } 
              }}
            >
              UPDATE
            </button>
            <button
              onClick={() => {
                removeTag("f252cbc9-b42c-4fbe-a500-68e232546d8b");
              }}
            >
              DELETE
            </button>
          </div>
        </div>
      ) : (
        <EmptyDashboard
          emoji={EMOJI.forkAndKnife}
          title="No dishes yet"
          subtitle="Start by adding your favorite dishes to your collection"
          btnText="Add your first dish"
        />
      )}
    </div>
  );
}
