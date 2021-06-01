import React from "react";

export const CategoriesSelector = ({
  proTheme,
  isVisible,
  showSocial,
  selectedCategoryId,
  proCategories,
  proCategories_youtube,
  proCategories_instagram,
  handleCategorySelection,
}) => {
  const selectProCategories = (showSocial) => {
    if (showSocial == "tiktok") {
      return proCategories;
    } else if (showSocial == "youtube") {
      return proCategories_youtube;
    } else if (showSocial == "instagram") {
      return proCategories_instagram;
    }
  };

  if (showSocial == "allProductLinks") {
    return <div></div>;
  }

  return (
    <div
      className="pro_profile_top_selector"
      style={
        isVisible
          ? null
          : {
              backgroundColor: "white",
              position: "fixed",
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
          } else if (showSocial == "instagram") {
            handleCategorySelection("all_instagram");
          }
        }}
      >
        <span>🌎</span>
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
            {proCategoryImage.includes(".png") ? (
              <img src={proCategoryImage} style={{ height: 10 }} />
            ) : (
              <span
                style={
                  selectedCategoryId == id
                    ? { margin: 3, fontSize: 10 }
                    : { margin: 3, fontSize: 10 }
                }
              >
                {proCategoryImage}
              </span>
            )}

            <p
              style={{
                color: proTheme.categoryWordsColor,
              }}
            >
              {proCategoryName}
            </p>
          </div>
        )
      )}
    </div>
  );
};
