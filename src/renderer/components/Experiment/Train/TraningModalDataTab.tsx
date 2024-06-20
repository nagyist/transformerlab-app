import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  Option,
  Textarea,
  Typography,
} from '@mui/joy';
import useSWR from 'swr';
import * as chatAPI from 'renderer/lib/transformerlab-api-sdk';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TrainingModalDataTab({
  datasetsIsLoading,
  datasets,
  selectedDataset,
  setSelectedDataset,
  currentDatasetInfoIsLoading,
  currentDatasetInfo,
  templateData,
  injectIntoTemplate,
  experimentInfo,
  pluginId,
}) {
  const { data, error, isLoading, mutate } = useSWR(
    experimentInfo?.id &&
      pluginId &&
      chatAPI.Endpoints.Experiment.ScriptGetFile(
        experimentInfo?.id,
        pluginId,
        'index.json'
      ),
    fetcher
  );

  const parsedData = data ? JSON.parse(data) : null;
  return (
    <>
      {/* <pre>{JSON.stringify(templateData, null, 2)}</pre> */}
      <FormControl>
        <FormLabel>Dataset</FormLabel>

        <Select
          placeholder={datasetsIsLoading ? 'Loading...' : 'Select Dataset'}
          variant="soft"
          size="lg"
          name="dataset_name"
          value={selectedDataset}
          onChange={(e, newValue) => setSelectedDataset(newValue)}
        >
          {datasets?.map((row) => (
            <Option value={row?.dataset_id} key={row.id}>
              {row.dataset_id}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Divider />
      <br />
      <br />
      {selectedDataset && (
        <>
          <FormControl>
            <FormLabel>Available Fields</FormLabel>

            <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {currentDatasetInfoIsLoading && <CircularProgress />}
              {/* // For each key in the currentDatasetInfo.features object,
  display it: */}
              {currentDatasetInfo?.features &&
                Object.keys(currentDatasetInfo?.features).map((key) => (
                  <>
                    <Chip
                      onClick={() => {
                        injectIntoTemplate(key);
                      }}
                    >
                      {key}
                    </Chip>
                    &nbsp;
                  </>
                ))}
            </Box>

            {selectedDataset && (
              <FormHelperText>
                Use the field names above, surrounded by
                &#123;&#123;&#125;&#125; in the template below
              </FormHelperText>
            )}
          </FormControl>
          <Divider sx={{ mt: '1rem', mb: '2rem' }} />
          <Typography level="title-sm" pb={2}>
            Template
          </Typography>
          {parsedData?.training_template_format == 'alpaca' ? (
            <>
              <FormControl>
                <FormLabel>Instruction</FormLabel>
                <Textarea
                  required
                  name="instruction_template"
                  id="instruction"
                  defaultValue={
                    templateData
                      ? templateData?.config?.instruction_template
                      : 'Instruction: {{instruction}}'
                  }
                  rows={5}
                />
                <FormHelperText>
                  The instruction (aka system message) to send to the model. For
                  example in a summarization task, this could be "Summarize the
                  following text:"
                </FormHelperText>
              </FormControl>
              <br />
              <FormControl>
                <FormLabel>Input</FormLabel>
                <Textarea
                  required
                  name="input_template"
                  id="Input"
                  defaultValue={
                    templateData
                      ? templateData?.config?.input_template
                      : '{{input}}'
                  }
                  rows={5}
                />
              </FormControl>
              <FormHelperText>
                The input to send to the model. For example in a summarization
                task, this could be the text to summarize.
              </FormHelperText>
              <br />
              <FormControl>
                <FormLabel>Output</FormLabel>
                <Textarea
                  required
                  name="output_template"
                  id="output"
                  defaultValue={
                    templateData
                      ? templateData?.config?.output_template
                      : '{{output}}'
                  }
                  rows={5}
                />
                <FormHelperText>
                  The output to expect from the model. For example in a
                  summarization task this could be the expected summary of the
                  input text.
                </FormHelperText>
              </FormControl>
            </>
          ) : (
            <>
              <FormControl>
                <textarea
                  required
                  name="formatting_template"
                  id="formatting_template"
                  defaultValue={
                    templateData
                      ? templateData.config.formatting_template
                      : 'Instruction: {{instruction}} \n###\n Prompt: {{prompt}}\n###\n Generation: {{generation}}'
                  }
                  rows={5}
                />
                <FormHelperText>
                  This describes how the data is formatted when passed to the
                  trainer. Use Jinja2 Standard String Templating format. For
                  example <br />
                  "Instruction:
                  &#123;&#123;instruction&#125;&#125;\n###\nPrompt:
                  &#123;&#123;prompt&#125;&#125;\n###\n Generation:
                  &#123;&#123;generation&#125;&#125;"
                </FormHelperText>
              </FormControl>
            </>
          )}
        </>
      )}
    </>
  );
}