// Construction & machinery photography — free to use under the Unsplash License
// (https://unsplash.com/license). Served from Unsplash's image CDN at responsive sizes.
const base = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=72`

export function unsplash(id) {
  return {
    src: `${base(id)}&w=1600`,
    srcSet: [640, 1080, 1600, 2200].map((w) => `${base(id)}&w=${w} ${w}w`).join(', '),
  }
}

export const photos = {
  fleet: { ...unsplash('1610477865545-37711c53144d'), alt: 'Modern excavator, dozer and trucks lined up on a construction yard', credit: 'Zizi zi' },
  loader: { ...unsplash('1560872531-552417aded86'), alt: 'Wheel loader moving aggregate on a large earthworks site', credit: 'Lachlan Cormie' },
  concrete: { ...unsplash('1524177536702-14df4a2a0a71'), alt: 'Aerial view of concrete mixer trucks at a batching yard', credit: 'Claus Grünstäudl' },
  cranes: { ...unsplash('1767926190150-219df0f0640f'), alt: 'Two luffing tower cranes against a clear blue sky', credit: 'Kouji Tsuru' },
  crew: { ...unsplash('1652303518372-79ad122e3181'), alt: 'Site team in safety gear beside excavators on a foundation dig', credit: 'John Kakuk' },
  tower: { ...unsplash('1604701145698-2b38c3e20124'), alt: 'Modern residential tower nearing completion with a crane on top', credit: 'Scott Webb' },
  steel: { ...unsplash('1527335988388-b40ee248d80c'), alt: 'Steel building frame rising beside a tower crane', credit: 'Jacek Dylag' },
  towerCrane: { ...unsplash('1541888660500-cce0122eadeb'), alt: 'Tower crane working between buildings under construction', credit: 'Scott Blake' },
  buildingCrane: { ...unsplash('1678740386174-5b267bbf258b'), alt: 'Large building under construction with a crane in front', credit: 'Erik Mclean' },
  apartment: { ...unsplash('1766321258844-6541b34b2940'), alt: 'Completed modern apartment building against a blue sky', credit: 'Thomas Leblanc' },
}
