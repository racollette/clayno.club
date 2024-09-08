import { Button } from "../../@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../../@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../@/components/ui/dropdown-menu"

export default function Welcome() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <main className="flex-1">
        <section className="w-full bg-gradient-to-r from-[#00b894] to-[#55efc4] py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tighter text-primary-foreground sm:text-5xl lg:text-6xl">
                Welcome to Claynotopia
              </h1>
              <p className="mt-4 text-lg text-primary-foreground md:text-xl">
                Welcome to the world of Claynosaurz —an exciting journey awaits. Our Collectors Guide is here to help
                you navigate the ins and outs of Claynotopia.
              </p>
              <div className="mt-8">
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  Explore Claynosaurz
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                    Discover the Claynosaurz Collections
                  </h2>
                  <p className="mt-4 text-muted-foreground md:text-xl">
                    Explore the diverse range of Claynosaurz collectibles and learn more about each unique collection.
                  </p>
                </div>
                <Collapsible className="space-y-4">
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-state=open]>svg]:rotate-90">
                    Genesis (10234) 2022
                    <ChevronRightIcon className="h-5 w-5 transition-all" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        Species
                        <ChevronRightIcon className="h-5 w-5 transition-all" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[200px]">
                        <DropdownMenuItem>T-Rex</DropdownMenuItem>
                        <DropdownMenuItem>Velociraptor</DropdownMenuItem>
                        <DropdownMenuItem>Spinosaurus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="space-y-4">
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-state=open]>svg]:rotate-90">
                    Ancients
                    <ChevronRightIcon className="h-5 w-5 transition-all" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pt-2">
                    <p>CAB/JERVIS SHORT COMMENT ON ANCIENTS</p>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="space-y-4">
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-state=open]>svg]:rotate-90">
                    Dactyls
                    <ChevronRightIcon className="h-5 w-5 transition-all" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pt-2">
                    <p>CAB/JERVIS SHORT COMMENT ON DACTYLS</p>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="space-y-4">
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-state=open]>svg]:rotate-90">
                    The Art Ones
                    <ChevronRightIcon className="h-5 w-5 transition-all" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pt-2">
                    <p>CAB/JERVIS SHORT COMMENT ON SPRAY CANS</p>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="space-y-4">
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-state=open]>svg]:rotate-90">
                    Claynosaurz Saga (2000) 2023
                    <ChevronRightIcon className="h-5 w-5 transition-all" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        Species
                        <ChevronRightIcon className="h-5 w-5 transition-all" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[200px]">
                        <DropdownMenuItem>T-Rex</DropdownMenuItem>
                        <DropdownMenuItem>Velociraptor</DropdownMenuItem>
                        <DropdownMenuItem>Spinosaurus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p>CAB/JERVIS SHORT COMMENT ON SAGA COLLECTION</p>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="space-y-4">
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-state=open]>svg]:rotate-90">
                    Cosmetics Collection
                    <ChevronRightIcon className="h-5 w-5 transition-all" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        Types
                        <ChevronRightIcon className="h-5 w-5 transition-all" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[200px]">
                        <DropdownMenuItem>Skins</DropdownMenuItem>
                        <DropdownMenuItem>Accessories</DropdownMenuItem>
                        <DropdownMenuItem>Emotes</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p>JACQUES SHORT COMMENT ON COSMETICS/IN-GAME ITEMS</p>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="space-y-4">
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&[data-state=open]>svg]:rotate-90">
                    Claymaker and Clay
                    <ChevronRightIcon className="h-5 w-5 transition-all" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 px-4 pt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        Types
                        <ChevronRightIcon className="h-5 w-5 transition-all" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[200px]">
                        <DropdownMenuItem>Claymaker</DropdownMenuItem>
                        <DropdownMenuItem>Clay</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#00b894] to-[#55efc4]">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl">
                Explore the Claynosaurz Metaverse
              </h2>
              <p className="mt-4 text-lg text-primary-foreground md:text-xl">
                Step into the immersive world of Claynotopia and discover the endless possibilities of the Claynosaurz
                Metaverse.
              </p>
              <div className="mt-8">
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  Enter the Metaverse
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}