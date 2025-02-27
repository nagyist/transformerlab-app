import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
  Textarea,
} from '@mui/joy';
import { useState } from 'react';

import * as chatAPI from 'renderer/lib/transformerlab-api-sdk';
import useSWR from 'swr';
import { node } from 'webpack';

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function NewNodeModal({
  open,
  onClose,
  selectedWorkflow,
  experimentInfo,
}) {
  const [mode, setMode] = useState('OTHER');

  console.log(mode);

  const {
    data: trainingTemplatesData,
    error: trainingTemplatesError,
    isLoading: isLoading,
  } = useSWR(chatAPI.GET_TRAINING_TEMPLATE_URL(), fetcher);

  const evaluationData = JSON.parse(experimentInfo?.config?.evaluations);

  const handleModeChange = (event: any, newValue: string) => {
    setMode(newValue);
  };

  return (
    <Modal open={open} onClose={() => onClose()}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>Create new Node</DialogTitle>
        <DialogContent>text</DialogContent>
        <form
          onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const name = formData.get('name') as string;
            if (mode == 'TRAIN') {
              const template = formData.get('trainingTemplate') as string;
              const config = JSON.parse(selectedWorkflow.config);
              console.log(config);
              const node = {
                name: name,
                type: 'TRAIN',
                template: template,
              };
              await fetch(
                chatAPI.Endpoints.Workflows.AddNode(
                  selectedWorkflow.id,
                  JSON.stringify(node)
                )
              );
            } else if (mode == 'EVAL') {
              const template = formData.get('evalTemplate') as string;
              const config = JSON.parse(selectedWorkflow.config);
              console.log(config);
              const node = {
                name: name,
                type: 'EVAL',
                template: template,
              };
              await fetch(
                chatAPI.Endpoints.Workflows.AddNode(
                  selectedWorkflow.id,
                  JSON.stringify(node)
                )
              );
            } else {
              const node = JSON.parse(formData.get('node') as string);
              node.name = name;
              await fetch(
                chatAPI.Endpoints.Workflows.AddNode(
                  selectedWorkflow.id,
                  JSON.stringify(node)
                )
              );
            }
            onClose();
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input autoFocus required name="name" />
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                labelId="mode-label"
                id="mode-select"
                value={mode}
                onChange={handleModeChange}
              >
                <Option value="TRAIN">TRAIN</Option>
                <Option value="EVAL">EVAL</Option>
                <Option value="OTHER">OTHER</Option>
              </Select>
            </FormControl>

            <FormControl>
              {mode == 'TRAIN' && (
                <>
                  <FormLabel>Training Template</FormLabel>
                  <Select name="trainingTemplate">
                    {trainingTemplatesData.map((template) => (
                      <Option value={template[1]}>{template[1]}</Option>
                    ))}
                  </Select>
                </>
              )}
              {mode == 'EVAL' && (
                <>
                  <FormLabel>Eval Template</FormLabel>
                  <Select name="evalTemplate">
                    {evaluationData.map((template) => (
                      <Option value={template.name}>{template.name}</Option>
                    ))}
                  </Select>
                </>
              )}
              {mode == 'OTHER' && (
                <>
                  <FormLabel>Nodes</FormLabel>
                  <Textarea minRows={4} autoFocus required name="node" />
                </>
              )}
            </FormControl>

            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
