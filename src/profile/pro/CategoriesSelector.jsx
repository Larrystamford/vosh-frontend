import React from "react";

export const CategoriesSelector = ({
  proTheme,
  isVisible,
  showSocial,
  selectedCategoryId,
  proCategories,
  proCategories_youtube,
  handleCategorySelection,
}) => {
  const selectProCategories = (showSocial) => {
    if (showSocial == "tiktok") {
      return proCategories;
    }
    return [];
  };

  if (showSocial == "allProductLinks" || showSocial == "youtube") {
    return <div></div>;
  }

  if (selectProCategories(showSocial).length > 0) {
    return (
      <div
        className="pro_profile_top_selector"
        style={
          isVisible
            ? null
            : {
                backgroundColor: "white",
                position: "fixed",
                opacity: 0.85,
              }
        }
      >
        <div
          className="pro_profile_icon_and_name_row"
          onClick={() => {
            if (showSocial == "tiktok") {
              handleCategorySelection("all");
            } else if (showSocial == "youtube") {
              handleCategorySelection("all_youtube");
            } else if (showSocial == "allProductLinks") {
              handleCategorySelection("all_read");
            }
          }}
        >
          <p
            style={{
              color: proTheme.categoryWordsColor,
            }}
          >
            all
          </p>
        </div>

        {selectProCategories(showSocial).map(
          ({ id, proCategoryName, proCategoryImage }) => (
            <div
              className="pro_profile_icon_and_name_row"
              onClick={() => {
                handleCategorySelection(id, proCategoryName);
              }}
            >
              <p
                style={{
                  color: proTheme.categoryWordsColor,
                  fontWeight: 500,
                }}
              >
                {proCategoryName}
              </p>
            </div>
          )
        )}
      </div>
    );
  }

  return null;
};

{
  /* <span>🌎</span> */
}

// {proCategoryImage.includes(".png") ? (
//   <img src={proCategoryImage} style={{ height: 10 }} />
// ) : (
//   <span
//     style={
//       selectedCategoryId == id
//         ? { margin: 3, fontSize: 10 }
//         : { margin: 3, fontSize: 10 }
//     }
//   >
//     {proCategoryImage}
//   </span>
// )}
