//////////////////////////////////////////////////////////////////////////////////////
//    Author - Almaash Alam
//    Version - 1.0
//    Date - 29/09/2023
//    Revision - 1
//    Project - JUIDCO
//    Component  - ThemeStyleTanker
//    DESCRIPTION -ThemeStyleTanker
//////////////////////////////////////////////////////////////////////////////////////

export default function ThemeStyleTanker() {
  let style = {
    saveButtonColor:
      "bg-[#6AB783] px-7 py-2 text-white font-semibold rounded leading-5 shadow-lg",
    addButtonColor:
      "bg-[#4338CA] hover:bg-indigo-500 px-4 py-2 text-white font-semibold rounded leading-5 shadow-lg flex items-center gap-2",
    cancelButtonColor:
      "bg-red-300 px-4 py-2 text-[#454646] font-semibold rounded leading-5 shadow-lg",
    inputStyle:
      "border border-gray-100 shadow-md shadow-gray-200 rounded leading-5 px-2 py-1 font-PublicSans",
    labelStyle: "text-md text-[#454646] opacity-80  font-PublicSans",
    headingStyle:
      "text-3xl text-[#454646] opacity-90 font-bold  font-PublicSans",
    titleStyle:
      "text-xl text-[#454646] opacity-80 font-semibold   font-PublicSans",
    formStyle:
      "border border-gray-200 shadow-md shadow-gray-300 rounded-lg  bg-white  ",
  };

  return style;
}
