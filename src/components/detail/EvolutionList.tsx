import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { evolutionChainIdAtom } from "@state/evolutionChainId";
import { getEvolution } from "@api";
import { getIdFromUrl } from "@utils";
import { Title, Container } from "@styles/detail/PokemonInfo";
import * as S from "@styles/detail/EvolutionList";
import { Chain } from "@/types/PokemonEvolutionChain";

interface Evolution {
  name: string;
  id: string;
}

const EvolutionList = () => {
  const evolutionChainId = useAtomValue(evolutionChainIdAtom);
  const { data: evolutionData } = useQuery({
    queryKey: ["evolution", evolutionChainId],
    queryFn: () => (evolutionChainId ? getEvolution(evolutionChainId) : null),
    select(res) {
      return res?.data;
    },
  });

  const flatChain = (data: Chain, bucket: Evolution[] = []): Evolution[] => {
    const { name, url } = data.species;
    bucket.push({ name, id: getIdFromUrl(url) });
    if (data.evolves_to.length === 0) return bucket;
    return flatChain(data.evolves_to[0], bucket);
  };

  return (
    evolutionData && (
      <Container>
        <Title>진화 단계</Title>
        {flatChain(evolutionData.chain).map(({ id, name }) => (
          <S.Stage key={id} to={`/detail/${id}`}>
            {name}↗
          </S.Stage>
        ))}
      </Container>
    )
  );
};

export default EvolutionList;
