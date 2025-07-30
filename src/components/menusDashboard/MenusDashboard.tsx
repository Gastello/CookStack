// import {
//   DndContext,
//   useDraggable,
//   useDroppable,
//   type DragEndEvent,
// } from "@dnd-kit/core";
// import { useState } from "react";

import { Link } from "react-router-dom";
import { useMenusStore, type MenuType } from "../../store/menusStore";
import Emoji, { EMOJI } from "../emoji/Emoji";
import { useEffect, useState } from "react";

// type MenuItemType = "title" | "text" | "image" | "dish";

// type MenuItemBlock = {
//   id: string;
//   type: MenuItemType;
//   value: string;
// };

// type MenuRow = {
//   id: string;
//   children: MenuItemBlock[];
// };

// export default function MenusDashboard() {
//   const [rows, setRows] = useState<MenuRow[]>([]);

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { over, active } = event;
//     if (!over) return;

//     const fromToolbox = active.id.toString().startsWith("tool-");

//     if (fromToolbox) {
//       const type = active.id.toString().replace("tool-", "") as MenuItemType;
//       const newItem: MenuItemBlock = {
//         id: crypto.randomUUID(),
//         type,
//         value: "",
//       };

//       const dropIndex = parseInt(
//         over.id.toString().replace("dropzone-", ""),
//         10
//       );

//       setRows((prev) => {
//         const newRows = [...prev];
//         const newRow: MenuRow = {
//           id: crypto.randomUUID(),
//           children: [newItem],
//         };
//         newRows.splice(dropIndex, 0, newRow);
//         return newRows;
//       });
//     }
//   };

//   return (
//     <DndContext onDragEnd={handleDragEnd}>
//       <div className="flex gap-6">
//         <Sidebar />
//         <div className="flex flex-col gap-2 w-full">
//           {rows.map((row, i) => (
//             <div key={row.id} className="flex flex-col gap-1">
//               <DropZone id={`dropzone-${i}`} />
//               <MenuRow row={row} />
//             </div>
//           ))}
//           <DropZone id={`dropzone-${rows.length}`} />
//         </div>
//       </div>
//     </DndContext>
//   );
// }

// function Sidebar() {
//   const types: MenuItemType[] = ["title", "text", "image", "dish"];
//   return (
//     <div className="flex flex-col gap-2 w-[120px]">
//       {types.map((type) => (
//         <Draggable key={type} id={`tool-${type}`}>
//           <div className="p-2 bg-gray-200 rounded cursor-grab text-center capitalize">
//             {type}
//           </div>
//         </Draggable>
//       ))}
//     </div>
//   );
// }

// function Draggable({
//   children,
//   id,
// }: {
//   children: React.ReactNode;
//   id: string;
// }) {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
//   const style = transform
//     ? {
//         transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
//       }
//     : undefined;

//   return (
//     <div
//       ref={setNodeRef}
//       style={{
//         ...style,
//         touchAction: "none",
//         zIndex: 50,
//         position: "relative",
//       }}
//       className="select-none cursor-grab"
//       {...listeners}
//       {...attributes}
//     >
//       {children}
//     </div>
//   );
// }

// function DropZone({ id }: { id: string }) {
//   const { isOver, setNodeRef } = useDroppable({ id });
//   return (
//     <div
//       ref={setNodeRef}
//       className={`h-[20px] w-full transition-all ${
//         isOver ? "bg-blue-300" : "bg-gray-100"
//       }`}
//     />
//   );
// }

// function MenuRow({ row }: { row: MenuRow }) {
//   return (
//     <div className="flex gap-2 border rounded p-2 min-h-[60px]">
//       {row.children.map((child) => (
//         <MenuItemBlock key={child.id} item={child} />
//       ))}
//     </div>
//   );
// }

// function MenuItemBlock({ item }: { item: MenuItemBlock }) {
//   const label = {
//     title: "📝 Title",
//     text: "✏️ Text",
//     image: "🖼️ Image",
//     dish: "🍽️ Dish",
//     emoji: "🔥 Emoji",
//   }[item.type];

//   return (
//     <div className="px-4 py-2 bg-white border rounded shadow text-sm">
//       {label}
//     </div>
//   );
// }

export default function MenusDashboard() {
  const menus = useMenusStore((s) => s.menus);
  const makeFav = useMenusStore((s) => s.makeFav);
  const colsClass = [
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
  ];

  const cols = Math.min(menus.length, 4);

  const getFiltredMenus = useMenusStore((s) => s.getFiltredMenus);
  const filter = useMenusStore((s) => s.filter);

  const [filtredMenus, setFiltredMenus] = useState<MenuType[]>([]);

  useEffect(() => {
    setFiltredMenus(getFiltredMenus());
  }, [menus, filter]);

  return (
    <div className={`mt-[20px] grid ${colsClass[cols - 1]} gap-[20px]`}>
      {filtredMenus.map((menu) => {
        return (
          <div
            key={menu.menu_id}
            className="bg-white rounded-2xl shadow-sm p-[10px] pt-[20px] flex flex-col gap-[10px] justify-between"
          >
            <div className="flex justify-between gap-[5px]">
              <div>
                <div className="font-medium text-left text-[16px] text-[#1F2937] mb-[8px]">
                  <Link to={menu.menu_id}>{menu.name}</Link>
                </div>
                <div className="text-[12px]/[20px] text-[#6B7280]">
                  <span className="mr-[5px]">
                    <Emoji size="12px" name={EMOJI.clock} />
                  </span>
                  {menu.time} min
                </div>
                <div className="text-[12px]/[20px] text-[#6B7280]">
                  <span className="mr-[5px]">
                    <Emoji size="12px" name={EMOJI.fire} />
                  </span>
                  {menu.calories} cal
                </div>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => makeFav(menu.menu_id)}
              >
                {menu.is_fav ? (
                  <Emoji name={EMOJI.heartRed} size="22px" />
                ) : (
                  <Emoji name={EMOJI.heartGray} size="22px" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
