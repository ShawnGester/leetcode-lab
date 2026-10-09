import { Workspace } from "@/components/Workspace";
import { problems } from "@/lib/problems";

export default function Home() {
  return <Workspace problems={problems} />;
}
