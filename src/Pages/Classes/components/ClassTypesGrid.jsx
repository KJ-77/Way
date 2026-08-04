import ClassTypeCard from "./ClassTypeCard";

// Responsive grid of class categories. `packageCounts` maps class_type_id →
// number of packages, so each card can advertise how many options sit behind it
// without a second request per card.
const ClassTypesGrid = ({ classTypes, packageCounts = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
    {classTypes.map((classType, idx) => (
      <ClassTypeCard
        key={classType.id}
        classType={classType}
        packageCount={packageCounts[classType.id] ?? 0}
        variantIndex={idx}
      />
    ))}
  </div>
);

export default ClassTypesGrid;
