import { useTranslations } from 'next-intl';

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';

import { CreateSourceFile } from './file';
import { CreateSourceLink } from './link';

export const CreateSourceDialog = () => {
  const t = useTranslations()
  return (
    <div>
      <DialogHeader>
        <DialogTitle>{t/*i18n*/("Create Source")}</DialogTitle>
        <DialogDescription>
          {t/*i18n*/("Create a new source")}
        </DialogDescription>
      </DialogHeader>
      <Tabs>
        <TabsList>
          <TabsTrigger value='file'>{t/*i18n*/("File")}</TabsTrigger>
          <TabsTrigger value='link'>{t/*i18n*/("Link")}</TabsTrigger>
        </TabsList>
        <TabsContent value='file'>
          <CreateSourceFile/>
        </TabsContent>
        <TabsContent value='link'>
          <CreateSourceLink />
        </TabsContent>
      </Tabs>
    </div>
  )
}