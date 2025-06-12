// components/CategoryTree.js
import { HiFolder } from "react-icons/hi2";
import { VscNewFolder } from "react-icons/vsc";
import { FaFolderTree } from "react-icons/fa6";
import Button from "./Button";

export default function CategoryTree({
  category,
  selectedCategory,
  onCategoryClick,
  onTreeModalOpen,
  onAddModalOpen,
  level = 0,
}) {
  return (
    <div style={{ marginLeft: level * 12 }}>
      <div className="flex items-center gap-1 mb-1">
        <div className="flex-grow">
          <Button
            variant={selectedCategory?.id === category.id ? "SubjectDefault" : "SubjectOther"}
            onClick={() => onCategoryClick(category)}
            className={`w-full ${
              selectedCategory?.id === category.id
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "hover:bg-blue-50"
            }`}
            style={{ minHeight: "28px", padding: "2px 8px" }}
          >
            <div className="flex items-center">
              <HiFolder
                className={`inline-block mr-1 ${
                  selectedCategory?.id === category.id ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span
                className={`truncate ${
                  selectedCategory?.id === category.id
                    ? "text-blue-800 font-semibold"
                    : "text-gray-800"
                }`}
              >
                {category.name}
              </span>
              {category.videos && category.videos.length > 0 && (
                <span
                  className={`ml-1 text-sm ${
                    selectedCategory?.id === category.id ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  ({category.videos.length})
                </span>
              )}
            </div>
          </Button>
        </div>
        {/* 선택된 카테고리에만 root category와 동일한 버튼들 표시 */}
        {selectedCategory?.id === category.id && (
          <>
            <Button
              variant="SubjectOther"
              onClick={onTreeModalOpen}
              style={{ width: "auto", padding: "0.5rem" }}
            >
              <FaFolderTree />
            </Button>
            <Button
              onClick={onAddModalOpen}
              style={{ width: "auto", padding: "0.5rem" }}
              variant="SubjectOther"
            >
              <VscNewFolder />
            </Button>
          </>
        )}
      </div>

      {/* 자식 카테고리들 재귀 렌더링 */}
      {category.children &&
        category.children.length > 0 &&
        category.children.map((child) => (
          <CategoryTree
            key={child.id}
            category={child}
            selectedCategory={selectedCategory}
            onCategoryClick={onCategoryClick}
            onTreeModalOpen={onTreeModalOpen}
            onAddModalOpen={onAddModalOpen}
            level={level + 1}
          />
        ))}
    </div>
  );
}
