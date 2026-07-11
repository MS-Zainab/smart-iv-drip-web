// const SectionCard = ({ title, children, actionText }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
//         {actionText && (
//           <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
//             {actionText}
//           </button>
//         )}
//       </div>

//       {children}
//     </div>
//   );
// };

// export default SectionCard;
const SectionCard = ({ title, children, actionText, onAction }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold text-slate-800 break-words">
          {title}
        </h2>

        {actionText && (
          <button
            type="button"
            onClick={onAction}
            className="
              w-full sm:w-auto
              px-4 py-2
              rounded-xl
              bg-slate-900
              text-white
              text-sm
              font-medium
              hover:bg-slate-800
              transition
            "
          >
            {actionText}
          </button>
        )}
      </div>

      {children}
    </div>
  );
};

export default SectionCard;