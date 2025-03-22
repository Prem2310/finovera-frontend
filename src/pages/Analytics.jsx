import SebiRegulationCard from "../components/SebiRegulationCard";
import PageHeading from "../components/ui/PageHeading";
import { sebiCompliance } from "../data";

export default function Analytics() {
  return (
    <div className="">
      <PageHeading>
        Tax and regulations
        <div className="grid grid-cols-2 gap-4 mt-4">
          {sebiCompliance.map((data) => (
            <SebiRegulationCard key={data.title} data={data} />
          ))}
        </div>
      </PageHeading>
    </div>
  );
}
